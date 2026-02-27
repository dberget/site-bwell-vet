export const prerender = false;

import type { APIRoute } from 'astro';
import { listSites, listSitePages, listRootPages, isClientRepo } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

export const GET: APIRoute = async ({ url, cookies }) => {
  const ghToken = import.meta.env.GITHUB_TOKEN || '';
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    ghToken
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  const slug = url.searchParams.get('slug');
  const clientRepo = isClientRepo();

  if (!slug) {
    // List all sites (scoped for client logins)
    try {
      if (clientRepo) {
        // Client repo: single site, derive name from GITHUB_REPO
        const repoName = (import.meta.env.GITHUB_REPO as string).split('/').pop() || '';
        const siteName = repoName.replace(/^site-/, '');
        return new Response(JSON.stringify({ sites: [siteName] }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      let sites = await listSites(ghToken);
      if (auth.role === 'client' && auth.site) {
        sites = sites.filter(s => s === auth.site);
      }
      return new Response(JSON.stringify({ sites }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return new Response(JSON.stringify({ error: msg }), { status: 500 });
    }
  }

  // List pages for a specific site
  try {
    const pages = clientRepo
      ? await listRootPages(ghToken)
      : await listSitePages(slug, ghToken);
    return new Response(JSON.stringify({ slug, pages }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
