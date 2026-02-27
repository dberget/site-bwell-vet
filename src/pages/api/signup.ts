export const prerender = false;

import type { APIRoute } from 'astro';
import { putFileBase64 } from '../../lib/github';

async function sendDiscordNotification(lead: Record<string, string>) {
  const webhookUrl = import.meta.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const msg = [
    `**New Signup Lead** 🔔`,
    `**Business:** ${lead.businessName}`,
    `**Contact:** ${lead.contactName}`,
    `**Phone:** ${lead.phone}`,
    `**Email:** ${lead.email || 'Not provided'}`,
    `**Existing site:** ${lead.existingSite || 'None'}`,
    lead.message ? `**Message:** ${lead.message}` : '',
  ].filter(Boolean).join('\n');

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

export const POST: APIRoute = async ({ request }) => {
  const ghToken = import.meta.env.GITHUB_TOKEN;
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  }

  let data: Record<string, string>;
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    data = await request.json();
  } else {
    const form = await request.formData();
    data = Object.fromEntries(
      Array.from(form.entries()).map(([k, v]) => [k, String(v)])
    );
  }

  // Honeypot
  if (data.website) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { businessName, contactName, phone, email, existingSite, message } = data;

  if (!businessName || !contactName || !phone) {
    return new Response(
      JSON.stringify({ error: 'Business name, contact name, and phone are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const now = new Date();
  const lead = {
    businessName,
    contactName,
    phone,
    email: email || '',
    existingSite: existingSite || '',
    message: message || '',
    submittedAt: now.toISOString(),
  };

  try {
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const path = `data/leads/signup/${slug}-${timestamp}.json`;
    const content = Buffer.from(JSON.stringify(lead, null, 2)).toString('base64');
    await putFileBase64(path, content, `Signup lead: ${businessName}`, ghToken);

    // Send Discord notification (non-blocking)
    sendDiscordNotification(lead);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
