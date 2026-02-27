export const prerender = false;

import type { APIRoute } from 'astro';
import { getCommits } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    import.meta.env.GITHUB_TOKEN || ''
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const ghToken = import.meta.env.GITHUB_TOKEN;
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug parameter' }), { status: 400 });
  }

  try {
    const commits = await getCommits(`src/data/${slug}.ts`, ghToken, 10);
    return new Response(JSON.stringify(commits), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
