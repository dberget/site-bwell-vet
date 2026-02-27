export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { getFile, putFileBase64 } from '../../lib/github';
import { hashPassword, generatePassword } from '../../lib/auth';
import type { ClientsMap } from '../../lib/auth';
import { provisionSite } from '../../lib/provision';

async function sendDiscordNotification(msg: string, webhookUrl: string) {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: msg }),
    });
  } catch {
    // Best effort
  }
}

async function provisionClient(
  session: Stripe.Checkout.Session,
  ghToken: string,
  discordUrl?: string
) {
  const password = generatePassword();
  const passwordHash = hashPassword(password);

  // Read existing clients file (or start fresh)
  let clients: ClientsMap = {};
  let sha: string | undefined;
  try {
    const file = await getFile('data/clients.json', ghToken);
    clients = JSON.parse(file.content);
    sha = file.sha;
  } catch {
    // File doesn't exist yet
  }

  // Generate slug from business name
  const businessName = session.metadata?.business_name || 'New Client';
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Idempotent: don't overwrite if client already exists with same Stripe customer
  if (clients[slug]?.stripe_customer_id === session.customer) {
    console.log(`Client ${slug} already provisioned, skipping`);
    return;
  }

  clients[slug] = {
    password_hash: passwordHash,
    email: session.customer_email || '',
    business_name: businessName,
    plan: session.metadata?.plan || 'monthly',
    stripe_customer_id: String(session.customer || ''),
    created_at: new Date().toISOString(),
  };

  // Write to GitHub
  const content = Buffer.from(JSON.stringify(clients, null, 2)).toString('base64');
  await putFileBase64(
    'data/clients.json',
    content,
    `New client: ${businessName}`,
    ghToken,
    sha
  );

  console.log(`Provisioned client: ${slug} (${session.customer_email})`);

  // Auto-provision: create GitHub repo + Vercel project
  const demoSlug = session.metadata?.demo_slug || slug;
  const vercelToken = import.meta.env.VERCEL_API_TOKEN;
  let provisionResult: { repoUrl: string; siteUrl: string; adminUrl: string } | null = null;

  if (vercelToken) {
    try {
      provisionResult = await provisionSite({
        slug,
        demoSlug,
        businessName,
        password,
        clientEmail: session.customer_email || '',
        ghToken,
        vercelToken,
      });
      console.log(`Auto-provisioned site: ${provisionResult.siteUrl}`);
    } catch (err) {
      console.error('Auto-provisioning failed:', err);
    }
  }

  // Discord notification
  if (discordUrl) {
    const planLabel = session.metadata?.plan === 'annual' ? '$500/year' : '$50/month';
    const lines = [
      `**New Paying Client** 🎉`,
      `**Business:** ${businessName}`,
      `**Email:** ${session.customer_email || 'N/A'}`,
      `**Plan:** ${planLabel}`,
      `**Site slug:** \`${slug}\``,
      `**Admin password:** \`${password}\``,
    ];

    if (provisionResult) {
      lines.push(
        `**Site URL:** ${provisionResult.siteUrl}`,
        `**Admin URL:** ${provisionResult.adminUrl}`,
        `**Repo:** ${provisionResult.repoUrl}`
      );
    } else if (vercelToken) {
      lines.push(`⚠️ Auto-provisioning failed — manual setup needed`);
    } else {
      lines.push(`**Admin URL:** https://lakecountrywebservices.com/admin`);
    }

    await sendDiscordNotification(lines.join('\n'), discordUrl);
  }
}

async function handleCancellation(
  subscription: Stripe.Subscription,
  ghToken: string,
  discordUrl?: string
) {
  let clients: ClientsMap = {};
  let sha: string | undefined;
  try {
    const file = await getFile('data/clients.json', ghToken);
    clients = JSON.parse(file.content);
    sha = file.sha;
  } catch {
    return; // No clients file, nothing to update
  }

  // Find client by stripe_customer_id
  const customerId = String(subscription.customer);
  const entry = Object.entries(clients).find(
    ([, c]) => c.stripe_customer_id === customerId
  );

  if (!entry) {
    console.log(`No client found for customer ${customerId}`);
    return;
  }

  const [slug, client] = entry;
  clients[slug] = { ...client, cancelled_at: new Date().toISOString() };

  const content = Buffer.from(JSON.stringify(clients, null, 2)).toString('base64');
  await putFileBase64(
    'data/clients.json',
    content,
    `Subscription cancelled: ${client.business_name}`,
    ghToken,
    sha
  );

  console.log(`Cancelled client: ${slug}`);

  if (discordUrl) {
    await sendDiscordNotification(
      `**Subscription Cancelled** ⚠️\n**Business:** ${client.business_name}\n**Email:** ${client.email}`,
      discordUrl
    );
  }
}

export const POST: APIRoute = async ({ request }) => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return new Response('Webhook not configured', { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed');
    return new Response('Invalid signature', { status: 400 });
  }

  const ghToken = import.meta.env.GITHUB_TOKEN;
  const discordUrl = import.meta.env.DISCORD_WEBHOOK_URL;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('New client signed up:', {
        email: session.customer_email,
        business: session.metadata?.business_name,
        amount: session.amount_total,
      });

      if (ghToken) {
        try {
          await provisionClient(session, ghToken, discordUrl);
        } catch (err) {
          console.error('Provisioning failed:', err);
          // Still return 200 so Stripe doesn't retry endlessly
          // Admin will see the checkout.session.completed log and can provision manually
        }
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', {
        customer: invoice.customer,
        amount: invoice.amount_paid,
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', {
        customer: subscription.customer,
      });

      if (ghToken) {
        try {
          await handleCancellation(subscription, ghToken, discordUrl);
        } catch (err) {
          console.error('Cancellation handling failed:', err);
        }
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
