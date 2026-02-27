export const prerender = false;

import type { APIRoute } from 'astro';
import { putFileBase64, isClientRepo } from '../../lib/github';
import { getClients } from '../../lib/auth';

async function sendLeadEmail(to: string, site: string, lead: { name: string; phone: string; email: string; message: string }) {
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) return;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'leads@lakecountryweb.com',
      to,
      subject: `New lead from ${lead.name} — ${site}`,
      html: [
        `<h2>New Contact Form Submission</h2>`,
        `<p><strong>Name:</strong> ${lead.name}</p>`,
        `<p><strong>Phone:</strong> ${lead.phone}</p>`,
        lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : '',
        lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : '',
        `<hr><p style="color:#888;font-size:12px">From your website contact form</p>`,
      ].filter(Boolean).join('\n'),
    }),
  });

  if (!res.ok) {
    console.error(`Resend email failed: ${res.status} ${await res.text()}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const ghToken = import.meta.env.GITHUB_TOKEN;
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
  }

  const contentType = request.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let name: string;
  let phone: string;
  let email: string;
  let message: string;
  let site: string;
  let honeypot: string;

  if (isJson) {
    const body = await request.json();
    name = body.name || '';
    phone = body.phone || '';
    email = body.email || '';
    message = body.message || '';
    site = body.site || '';
    honeypot = body.website || '';
  } else {
    const formData = await request.formData();
    name = (formData.get('name') as string) || '';
    phone = (formData.get('phone') as string) || '';
    email = (formData.get('email') as string) || '';
    message = (formData.get('message') as string) || '';
    site = (formData.get('site') as string) || '';
    honeypot = (formData.get('website') as string) || '';
  }

  const origin = new URL(request.url).origin;
  const basePath = isClientRepo() ? '' : `/${site}`;

  // Honeypot: bots fill this in, real users don't
  if (honeypot) {
    if (isJson) {
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return Response.redirect(`${origin}${basePath}/?thanks=1#contact`, 303);
  }

  // Validate required fields
  if (!name || !phone || !site) {
    if (isJson) {
      return new Response(JSON.stringify({ error: 'Name, phone, and site are required' }), { status: 400 });
    }
    return Response.redirect(`${origin}${basePath}/#contact`, 303);
  }

  try {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const lead = { name, phone, email, message, submittedAt: now.toISOString() };

    const path = `data/leads/${site}/${timestamp}.json`;
    const content = Buffer.from(JSON.stringify(lead, null, 2)).toString('base64');
    await putFileBase64(path, content, `New lead from ${name}`, ghToken);

    // Send email notification (non-blocking)
    const notificationEmail = import.meta.env.NOTIFICATION_EMAIL;
    if (notificationEmail) {
      // Client repo: use NOTIFICATION_EMAIL env var directly
      sendLeadEmail(notificationEmail, site, { name, phone, email, message }).catch(() => {});
    } else {
      // Main repo: look up client email from clients.json
      const { data: clients } = await getClients(ghToken);
      const clientEmail = clients[site]?.email;
      if (clientEmail) {
        sendLeadEmail(clientEmail, site, { name, phone, email, message }).catch(() => {});
      }
    }

    if (isJson) {
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return Response.redirect(`${origin}${basePath}/?thanks=1#contact`, 303);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    if (isJson) {
      return new Response(JSON.stringify({ error: msg }), { status: 500 });
    }
    return Response.redirect(`${origin}${basePath}/#contact`, 303);
  }
};
