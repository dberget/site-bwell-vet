export const prerender = false;

import type { APIRoute } from 'astro';
import { getClients, hashPassword } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { password } = await request.json();
  const secret = import.meta.env.ADMIN_SECRET || 'siteengine2026';

  const cookieOpts = {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  };

  // Master admin login
  if (password === secret) {
    cookies.set('se_auth', secret, cookieOpts);
    return new Response(JSON.stringify({ ok: true, role: 'admin' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Client login: check against data/clients.json
  const ghToken = import.meta.env.GITHUB_TOKEN;
  if (ghToken) {
    const { data: clients } = await getClients(ghToken);
    const hash = hashPassword(password);
    for (const [slug, client] of Object.entries(clients)) {
      if (!client.cancelled_at && client.password_hash === hash) {
        cookies.set('se_auth', `client:${slug}:${password}`, cookieOpts);
        return new Response(
          JSON.stringify({ ok: true, role: 'client', site: slug }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return new Response(JSON.stringify({ ok: false, error: 'Wrong password' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
