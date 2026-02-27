const REPO = import.meta.env.GITHUB_REPO || 'dberget/site-engine';
const BRANCH = 'master';

interface GitHubFile {
  content: string;
  sha: string;
}

export async function getFile(path: string, token: string, branch = BRANCH): Promise<GitHubFile> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub GET ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha,
  };
}

export async function putFile(
  path: string,
  content: string,
  message: string,
  sha: string,
  token: string,
  branch = BRANCH
): Promise<{ commitSha: string }> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { commitSha: data.commit.sha };
}

export async function getCommits(
  path: string,
  token: string,
  perPage = 10
): Promise<{ sha: string; message: string; date: string; author: string }[]> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/commits?path=${encodeURIComponent(path)}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub commits ${path}: ${res.status} ${await res.text()}`);
  }

  const commits = await res.json();
  return commits.map((c: any) => ({
    sha: c.sha,
    message: c.commit.message,
    date: c.commit.author.date,
    author: c.commit.author.name,
  }));
}

export async function putFileBase64(
  path: string,
  contentBase64: string,
  message: string,
  token: string,
  existingSha?: string,
  branch = BRANCH
): Promise<{ commitSha: string }> {
  // If we have an existing sha, use it; otherwise try to get it (file may not exist yet)
  let sha = existingSha;
  if (!sha) {
    try {
      const existing = await getFile(path, token, branch);
      sha = existing.sha;
    } catch {
      // File doesn't exist yet, that's fine — omit sha for creation
    }
  }

  const body: Record<string, string> = {
    message,
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { commitSha: data.commit.sha };
}

export async function listDataFiles(token: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/src/data?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub list: ${res.status}`);
  }

  const files = await res.json();
  return files
    .filter((f: any) => f.name.endsWith('.ts') && f.name !== 'index.ts')
    .map((f: any) => f.name.replace('.ts', ''));
}

const EXCLUDED_PAGE_DIRS = new Set(['admin', 'api', 'pricing', '[slug]']);

export async function listSites(token: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/src/pages?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub list sites: ${res.status}`);
  }

  const entries = await res.json();
  return entries
    .filter((e: any) => e.type === 'dir' && !EXCLUDED_PAGE_DIRS.has(e.name))
    .map((e: any) => e.name);
}

export async function listSitePages(slug: string, token: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/src/pages/${slug}?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub list pages for ${slug}: ${res.status}`);
  }

  const files = await res.json();
  return files
    .filter((f: any) => f.name.endsWith('.astro'))
    .map((f: any) => f.name.replace('.astro', ''));
}

// Client repos have pages at src/pages/*.astro (root level)
const EXCLUDED_ROOT_PAGES = new Set(['index.astro']);

export async function listRootPages(token: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/src/pages?ref=${BRANCH}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub list root pages: ${res.status}`);
  }

  const entries = await res.json();
  return entries
    .filter((e: any) => e.type === 'file' && e.name.endsWith('.astro') && !EXCLUDED_ROOT_PAGES.has(e.name))
    .map((e: any) => e.name.replace('.astro', ''));
}

export function isClientRepo(): boolean {
  const envRepo = import.meta.env.GITHUB_REPO;
  return !!envRepo && envRepo !== 'dberget/site-engine';
}

// ===== Branch management =====

export async function getBranchSha(branch: string, token: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub get branch ${branch}: ${res.status}`);
  }

  const data = await res.json();
  return data.object.sha;
}

export async function createBranch(name: string, fromSha: string, token: string): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/refs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: `refs/heads/${name}`,
      sha: fromSha,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub create branch ${name}: ${res.status} ${await res.text()}`);
  }
}

export async function branchExists(name: string, token: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return res.ok;
}

export async function mergeBranch(
  base: string,
  head: string,
  message: string,
  token: string
): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/merges`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base,
      head,
      commit_message: message,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub merge ${head} → ${base}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.sha;
}

export async function deleteBranch(name: string, token: string): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/${name}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub delete branch ${name}: ${res.status}`);
  }
}
