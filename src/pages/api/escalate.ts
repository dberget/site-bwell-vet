export const prerender = false;

import type { APIRoute } from 'astro';
import { checkAuth } from '../../lib/auth';

// Client repos set GITHUB_REPO env var — use it directly.
// Main repo falls back to slug-based lookup for demo sites.
function getRepo(slug: string): string {
  const envRepo = import.meta.env.GITHUB_REPO;
  if (envRepo && envRepo !== 'dberget/site-engine') return envRepo;

  const mainSlugs = [
    'becker-auto', 'boyd-lawn', 'bwell-vet', 'centrasota-electric',
    'lennes-bros-electric', 'mill-lake-resort', 'northside-collision',
    'now-and-then-antiques', 'quality-printing', 'rosengren-lawn',
  ];
  if (mainSlugs.includes(slug)) return 'dberget/site-engine';
  return `dberget/site-${slug}`;
}

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
    const body = await request.json();
    const { siteSlug, note, messages } = body as {
      siteSlug: string;
      note?: string;
      messages: { role: string; content: string }[];
    };

    if (!siteSlug || !messages?.length) {
      return new Response(JSON.stringify({ error: 'Missing site or messages' }), { status: 400 });
    }

    // Format chat transcript
    const transcript = messages
      .map((m) => `**${m.role === 'user' ? '👤 Client' : '🤖 Assistant'}:** ${m.content}`)
      .join('\n\n---\n\n');

    const issueBody = [
      `## Escalation Request`,
      `**Site:** \`${siteSlug}\``,
      `**Date:** ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`,
      note ? `**Client Note:** ${note}` : '',
      '',
      '## Chat History',
      '',
      transcript,
    ]
      .filter(Boolean)
      .join('\n');

    const repo = getRepo(siteSlug);

    // Ensure 'escalation' label exists
    await fetch(`https://api.github.com/repos/${repo}/labels`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'escalation',
        color: 'e74c3c',
        description: 'Client escalation — needs developer attention',
      }),
    });
    // Ignore error if label already exists

    // Create GitHub issue
    const issueRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `[Escalation] ${siteSlug} — ${note?.slice(0, 60) || 'Client needs developer help'}`,
        body: issueBody,
        labels: ['escalation'],
      }),
    });

    if (!issueRes.ok) {
      const errText = await issueRes.text();
      throw new Error(`GitHub issue creation failed: ${issueRes.status} ${errText}`);
    }

    const issue = await issueRes.json();

    return new Response(
      JSON.stringify({
        ok: true,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Escalation error:', msg);
    return new Response(JSON.stringify({ error: 'Failed to submit request. Please try again.' }), {
      status: 500,
    });
  }
};
