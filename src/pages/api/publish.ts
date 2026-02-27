export const prerender = false;

import type { APIRoute } from 'astro';
import { mergeBranch, deleteBranch } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
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

  try {
    const { siteSlug } = await request.json();
    if (!siteSlug) {
      return new Response(JSON.stringify({ error: 'Missing siteSlug' }), { status: 400 });
    }

    const previewBranch = `preview-${siteSlug}`;
    const commitSha = await mergeBranch('master', previewBranch, `Publish ${siteSlug} changes`, ghToken);
    await deleteBranch(previewBranch, ghToken);

    return new Response(JSON.stringify({ ok: true, commitSha }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
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

  try {
    const { siteSlug } = await request.json();
    if (!siteSlug) {
      return new Response(JSON.stringify({ error: 'Missing siteSlug' }), { status: 400 });
    }

    const previewBranch = `preview-${siteSlug}`;
    await deleteBranch(previewBranch, ghToken);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
