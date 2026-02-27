// Site provisioning: create GitHub repo from template, clean up, deploy to Vercel

const TEMPLATE_REPO = 'dberget/site-engine';
const GITHUB_API = 'https://api.github.com';
const VERCEL_API = 'https://api.vercel.com';

export interface ProvisionOptions {
  slug: string;
  demoSlug: string;
  businessName: string;
  password: string;
  ghToken: string;
  vercelToken: string;
  anthropicKey: string;
}

export interface ProvisionResult {
  repoUrl: string;
  siteUrl: string;
  adminUrl: string;
}

// --- GitHub helpers ---

async function ghFetch(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Step 1: Create repo from template ---

async function createRepoFromTemplate(slug: string, ghToken: string): Promise<string> {
  const repoName = `site-${slug}`;
  const res = await ghFetch(`/repos/${TEMPLATE_REPO}/generate`, ghToken, {
    method: 'POST',
    body: JSON.stringify({
      owner: 'dberget',
      name: repoName,
      private: false,
      description: `Website for ${slug}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Template generation failed: ${res.status} ${text}`);
  }

  // Template generation is async — poll until repo is ready
  for (let i = 0; i < 10; i++) {
    await sleep(2000);
    const check = await ghFetch(`/repos/dberget/${repoName}`, ghToken);
    if (check.ok) return repoName;
  }

  throw new Error(`Repo dberget/${repoName} not ready after 20s`);
}

// --- Step 2: Clean up repo via tree surgery ---

interface TreeEntry {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
}

async function cleanupRepo(repoName: string, demoSlug: string, ghToken: string): Promise<void> {
  const fullRepo = `dberget/${repoName}`;

  // Get the current master SHA
  const refRes = await ghFetch(`/repos/${fullRepo}/git/ref/heads/master`, ghToken);
  if (!refRes.ok) throw new Error(`Failed to get master ref: ${refRes.status}`);
  const refData = await refRes.json();
  const masterSha = refData.object.sha;

  // Get the commit to find the tree SHA
  const commitRes = await ghFetch(`/repos/${fullRepo}/git/commits/${masterSha}`, ghToken);
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status}`);
  const commitData = await commitRes.json();
  const treeSha = commitData.tree.sha;

  // Get full recursive tree
  const treeRes = await ghFetch(`/repos/${fullRepo}/git/trees/${treeSha}?recursive=1`, ghToken);
  if (!treeRes.ok) throw new Error(`Failed to get tree: ${treeRes.status}`);
  const treeData = await treeRes.json();
  const entries: TreeEntry[] = treeData.tree;

  // Define what to keep
  const keepRootFiles = new Set([
    'package.json', 'package-lock.json', 'astro.config.mjs',
    'vercel.json', 'tsconfig.json', '.gitignore', 'CLAUDE.md',
  ]);

  const keepPrefixes = [
    'src/components/',
    'src/schema/',
    'src/lib/',
    'src/pages/admin/',
    'src/pages/api/',
    `src/data/${demoSlug}.ts`,
    'src/data/index.ts',
  ];

  const publicKeepPrefixes = [
    'public/favicon',
    `public/images/${demoSlug}/`,
  ];

  // Pages to remap: src/pages/{demoSlug}/*.astro → src/pages/*.astro
  const demoPagePrefix = `src/pages/${demoSlug}/`;

  const newTree: { path: string; mode: string; type: string; sha: string }[] = [];
  const pagesToRemap: TreeEntry[] = [];

  for (const entry of entries) {
    if (entry.type === 'tree') continue; // Skip directory entries

    // Root config files
    if (!entry.path.includes('/') && keepRootFiles.has(entry.path)) {
      newTree.push({ path: entry.path, mode: entry.mode, type: 'blob', sha: entry.sha });
      continue;
    }

    // Keep prefixes
    if (keepPrefixes.some((p) => entry.path.startsWith(p) || entry.path === p)) {
      newTree.push({ path: entry.path, mode: entry.mode, type: 'blob', sha: entry.sha });
      continue;
    }

    // Public assets
    if (publicKeepPrefixes.some((p) => entry.path.startsWith(p))) {
      newTree.push({ path: entry.path, mode: entry.mode, type: 'blob', sha: entry.sha });
      continue;
    }

    // Demo pages to remap
    if (entry.path.startsWith(demoPagePrefix) && entry.path.endsWith('.astro')) {
      pagesToRemap.push(entry);
    }
  }

  // Process page files: read content, fix paths, create new blobs
  for (const page of pagesToRemap) {
    const blobRes = await ghFetch(`/repos/${fullRepo}/git/blobs/${page.sha}`, ghToken);
    if (!blobRes.ok) throw new Error(`Failed to read blob ${page.sha}`);
    const blobData = await blobRes.json();
    let content = Buffer.from(blobData.content, 'base64').toString('utf-8');

    // Fix import paths: ../../components/ → ../components/ (one level up less)
    content = content.replace(/\.\.\/\.\.\/components\//g, '../components/');
    content = content.replace(/\.\.\/\.\.\/lib\//g, '../lib/');
    content = content.replace(/\.\.\/\.\.\/schema\//g, '../schema/');

    // Fix link paths: /{demoSlug}/ → / and /{demoSlug}" → /"
    const slugPattern = new RegExp(`/${demoSlug}/`, 'g');
    const slugPatternEnd = new RegExp(`/${demoSlug}"`, 'g');
    content = content.replace(slugPattern, '/');
    content = content.replace(slugPatternEnd, '/"');

    // Create new blob
    const newBlobRes = await ghFetch(`/repos/${fullRepo}/git/blobs`, ghToken, {
      method: 'POST',
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    });
    if (!newBlobRes.ok) throw new Error(`Failed to create blob: ${newBlobRes.status}`);
    const newBlobData = await newBlobRes.json();

    // Remap path: src/pages/{demoSlug}/foo.astro → src/pages/foo.astro
    const fileName = page.path.slice(demoPagePrefix.length);
    newTree.push({ path: `src/pages/${fileName}`, mode: page.mode, type: 'blob', sha: newBlobData.sha });
  }

  // Create new tree
  const newTreeRes = await ghFetch(`/repos/${fullRepo}/git/trees`, ghToken, {
    method: 'POST',
    body: JSON.stringify({ tree: newTree }),
  });
  if (!newTreeRes.ok) throw new Error(`Failed to create tree: ${newTreeRes.status}`);
  const newTreeData = await newTreeRes.json();

  // Create commit
  const newCommitRes = await ghFetch(`/repos/${fullRepo}/git/commits`, ghToken, {
    method: 'POST',
    body: JSON.stringify({
      message: `Provision: clean repo for ${demoSlug}`,
      tree: newTreeData.sha,
      parents: [masterSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  const newCommitData = await newCommitRes.json();

  // Update master ref
  const updateRefRes = await ghFetch(`/repos/${fullRepo}/git/refs/heads/master`, ghToken, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommitData.sha, force: true }),
  });
  if (!updateRefRes.ok) throw new Error(`Failed to update ref: ${updateRefRes.status}`);
}

// --- Step 3: Create Vercel project ---

interface VercelEnvVar {
  key: string;
  value: string;
  target: string[];
  type: string;
}

async function createVercelProject(
  slug: string,
  repoName: string,
  envVars: VercelEnvVar[],
  vercelToken: string
): Promise<string> {
  // Create project linked to GitHub repo
  const res = await fetch(`${VERCEL_API}/v10/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      framework: 'astro',
      gitRepository: {
        type: 'github',
        repo: `dberget/${repoName}`,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel project creation failed: ${res.status} ${text}`);
  }

  const project = await res.json();
  const projectId = project.id;

  // Add environment variables
  for (const envVar of envVars) {
    const envRes = await fetch(`${VERCEL_API}/v10/projects/${projectId}/env`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(envVar),
    });

    if (!envRes.ok) {
      console.error(`Failed to set env var ${envVar.key}: ${envRes.status}`);
    }
  }

  return projectId;
}

// --- Orchestrator ---

export async function provisionSite(options: ProvisionOptions): Promise<ProvisionResult> {
  const { slug, demoSlug, businessName, password, ghToken, vercelToken, anthropicKey } = options;

  console.log(`[provision] Starting for ${slug} (demo: ${demoSlug})`);

  // Step 1: Create repo from template
  const repoName = await createRepoFromTemplate(slug, ghToken);
  console.log(`[provision] Repo created: dberget/${repoName}`);

  // Step 2: Clean up repo — remove other sites, remap pages to root
  await cleanupRepo(repoName, demoSlug, ghToken);
  console.log(`[provision] Repo cleaned up`);

  // Step 3: Create Vercel project with env vars
  const envVars: VercelEnvVar[] = [
    { key: 'GITHUB_REPO', value: `dberget/${repoName}`, target: ['production', 'preview'], type: 'encrypted' },
    { key: 'GITHUB_TOKEN', value: ghToken, target: ['production', 'preview'], type: 'encrypted' },
    { key: 'ADMIN_SECRET', value: password, target: ['production', 'preview'], type: 'encrypted' },
    { key: 'ANTHROPIC_API_KEY', value: anthropicKey, target: ['production', 'preview'], type: 'encrypted' },
  ];

  await createVercelProject(slug, repoName, envVars, vercelToken);
  console.log(`[provision] Vercel project created`);

  const siteUrl = `https://${repoName}.vercel.app`;
  const adminUrl = `${siteUrl}/admin`;
  const repoUrl = `https://github.com/dberget/${repoName}`;

  console.log(`[provision] Done: ${siteUrl}`);

  return { repoUrl, siteUrl, adminUrl };
}
