export const prerender = false;

import type { APIRoute } from 'astro';
import { checkAuth } from '../../lib/auth';

// Deploy is now automatic — committing to GitHub triggers Vercel redeploy
export const POST: APIRoute = async ({ cookies }) => {
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    import.meta.env.GITHUB_TOKEN || ''
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  return new Response(
    JSON.stringify({
      success: true,
      output: 'Changes are committed and deploying automatically. Site will update in ~30 seconds.',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
