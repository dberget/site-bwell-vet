export const prerender = false;

import type { APIRoute } from 'astro';
import { branchExists } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

const REPO = import.meta.env.GITHUB_REPO || 'dberget/site-engine';

export const GET: APIRoute = async ({ request, cookies }) => {
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

  const url = new URL(request.url);
  const sha = url.searchParams.get('sha');
  const ref = url.searchParams.get('ref');
  if (!sha && !ref) {
    return new Response(JSON.stringify({ error: 'Missing sha or ref parameter' }), { status: 400 });
  }

  try {
    // Find deployments by commit SHA or branch ref
    const query = sha ? `sha=${sha}` : `ref=${ref}`;
    const deploymentsRes = await fetch(
      `https://api.github.com/repos/${REPO}/deployments?${query}&per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!deploymentsRes.ok) {
      throw new Error(`GitHub deployments: ${deploymentsRes.status}`);
    }

    const deployments = await deploymentsRes.json();

    if (deployments.length === 0) {
      if (ref) {
        // Check if the branch exists even without deployments
        const exists = await branchExists(ref, ghToken);
        if (exists) {
          return new Response(
            JSON.stringify({ status: 'pending', message: 'Branch exists, waiting for deployment...', branchExists: true }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ status: 'not_found', message: 'No preview branch found', branchExists: false }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ status: 'pending', message: 'Waiting for deployment to start...' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deployment = deployments[0];

    // Get the latest status for this deployment
    const statusesRes = await fetch(
      `https://api.github.com/repos/${REPO}/deployments/${deployment.id}/statuses?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!statusesRes.ok) {
      throw new Error(`GitHub deployment statuses: ${statusesRes.status}`);
    }

    const statuses = await statusesRes.json();

    if (statuses.length === 0) {
      return new Response(
        JSON.stringify({ status: 'pending', message: 'Deployment created, waiting for status...' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const latest = statuses[0];

    // Map GitHub deployment state to our simplified status
    // GitHub states: error, failure, inactive, in_progress, queued, pending, success
    let status: string;
    let message: string;
    let deploymentUrl: string | null = null;

    switch (latest.state) {
      case 'success':
        status = 'success';
        message = 'Site is live!';
        deploymentUrl = latest.environment_url || latest.target_url || null;
        break;
      case 'in_progress':
      case 'queued':
        status = 'building';
        message = 'Building your site...';
        break;
      case 'error':
      case 'failure':
        status = 'error';
        message = latest.description || 'Deployment failed';
        break;
      case 'inactive':
        // Vercel marks old deployments as inactive — the URL is still valid for preview
        status = 'success';
        message = 'Preview available';
        deploymentUrl = latest.environment_url || latest.target_url || null;
        break;
      default:
        status = 'pending';
        message = latest.description || 'Waiting...';
    }

    return new Response(
      JSON.stringify({ status, message, deploymentUrl }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
