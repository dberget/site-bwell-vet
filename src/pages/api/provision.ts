export const prerender = false;

import type { APIRoute } from 'astro';
import { provisionSite } from '../../lib/provision';

export const POST: APIRoute = async ({ request }) => {
  const adminSecret = import.meta.env.ADMIN_SECRET || 'siteengine2026';
  const ghToken = import.meta.env.GITHUB_TOKEN;
  const vercelToken = import.meta.env.VERCEL_API_TOKEN;
  const anthropicKey = import.meta.env.ANTHROPIC_API_KEY;

  if (!ghToken || !vercelToken || !anthropicKey) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${adminSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { slug, demoSlug, businessName, password } = await request.json();
  if (!slug || !demoSlug) {
    return new Response(JSON.stringify({ error: 'slug and demoSlug required' }), { status: 400 });
  }

  try {
    const result = await provisionSite({
      slug,
      demoSlug,
      businessName: businessName || slug,
      password: password || 'changeme',
      ghToken,
      vercelToken,
      anthropicKey,
    });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Provision error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
