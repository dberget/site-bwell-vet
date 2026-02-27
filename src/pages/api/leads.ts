export const prerender = false;

import type { APIRoute } from 'astro';
import { checkAuth } from '../../lib/auth';

const REPO = 'dberget/site-engine';
const BRANCH = 'master';

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
    const dirPath = `data/leads/${slug}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (res.status === 404) {
      return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
    }

    if (!res.ok) {
      throw new Error(`GitHub: ${res.status}`);
    }

    const files = await res.json();
    if (!Array.isArray(files)) {
      return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });
    }

    // Sort by filename (timestamp-based) descending, limit to 50
    const sorted = files
      .filter((f: any) => f.name.endsWith('.json'))
      .sort((a: any, b: any) => b.name.localeCompare(a.name))
      .slice(0, 50);

    // Fetch each file's content in parallel
    const leads = await Promise.all(
      sorted.map(async (f: any) => {
        try {
          const fileRes = await fetch(
            `https://api.github.com/repos/${REPO}/contents/${f.path}?ref=${BRANCH}`,
            {
              headers: {
                Authorization: `Bearer ${ghToken}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
          if (!fileRes.ok) return null;
          const fileData = await fileRes.json();
          const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
          return JSON.parse(content);
        } catch {
          return null;
        }
      })
    );

    return new Response(JSON.stringify(leads.filter(Boolean)), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
