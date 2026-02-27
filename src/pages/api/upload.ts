export const prerender = false;

import type { APIRoute } from 'astro';
import { putFileBase64 } from '../../lib/github';
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
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const siteSlug = formData.get('siteSlug') as string | null;
    const branch = formData.get('branch') as string | undefined;

    if (!file || !siteSlug) {
      return new Response(JSON.stringify({ error: 'Missing file or siteSlug' }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ghPath = `public/images/${siteSlug}/${filename}`;

    await putFileBase64(
      ghPath,
      base64,
      `Upload ${filename} for ${siteSlug} via admin panel`,
      ghToken,
      undefined,
      branch
    );

    return new Response(JSON.stringify({ path: `/images/${siteSlug}/${filename}` }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Upload error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
