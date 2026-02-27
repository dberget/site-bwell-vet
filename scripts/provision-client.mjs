#!/usr/bin/env node

/**
 * provision-client.mjs
 *
 * Takes a business from the site-engine monorepo and creates a standalone
 * Vercel project with its own GitHub repo.
 *
 * Usage:
 *   node scripts/provision-client.mjs --slug lennes-bros-electric [--domain lenneselectric.com] [--dry-run]
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { parseArgs } from 'node:util';

// ── Parse arguments ──────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    slug:    { type: 'string' },
    domain:  { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
  strict: true,
});

const slug = args.slug;
const domain = args.domain;
const dryRun = args['dry-run'];

if (!slug) {
  console.error('Error: --slug is required');
  console.error('Usage: node scripts/provision-client.mjs --slug <slug> [--domain <domain>] [--dry-run]');
  process.exit(1);
}

// ── Paths ────────────────────────────────────────────────────────────────────

const MONOREPO  = resolve(import.meta.dirname, '..');
const DATA_FILE = join(MONOREPO, 'src', 'data', `${slug}.ts`);
const PAGE_DIR  = join(MONOREPO, 'src', 'pages', slug);
const PAGE_FILE = join(PAGE_DIR, 'index.astro');

// Figure out image subdirectory — the page file may reference a short alias
// (e.g. "lennes" instead of "lennes-bros-electric")
function detectImageSlug() {
  if (!existsSync(PAGE_FILE)) return slug;
  const content = readFileSync(PAGE_FILE, 'utf-8');
  const match = content.match(/images\/([a-z0-9_-]+)\//i);
  return match ? match[1] : slug;
}

const imageSlug = detectImageSlug();
const IMAGE_DIR = join(MONOREPO, 'public', 'images', imageSlug);

const REPO_NAME = `site-${slug}`;
const GITHUB_OWNER = 'dberget';
const OUT_DIR = join(MONOREPO, '..', REPO_NAME);

// ── Validation ───────────────────────────────────────────────────────────────

function validate() {
  const errors = [];
  if (!existsSync(DATA_FILE)) errors.push(`Data file not found: src/data/${slug}.ts`);
  if (!existsSync(PAGE_FILE)) errors.push(`Page file not found: src/pages/${slug}/index.astro`);
  if (!existsSync(IMAGE_DIR)) errors.push(`Image directory not found: public/images/${imageSlug}/`);
  if (errors.length) {
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  if (dryRun) return '';
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', ...opts }).trim();
}

function writeOut(relPath, content) {
  const dest = join(OUT_DIR, relPath);
  if (!dryRun) {
    mkdirSync(join(dest, '..'), { recursive: true });
    writeFileSync(dest, content, 'utf-8');
  }
  console.log(`  → ${relPath}`);
}

function copyFile(src, relDest) {
  const dest = join(OUT_DIR, relDest);
  if (!dryRun) {
    mkdirSync(join(dest, '..'), { recursive: true });
    cpSync(src, dest);
  }
  console.log(`  → ${relDest} (copied)`);
}

// ── Step 1: Create GitHub repo ──────────────────────────────────────────────

function createGitHubRepo() {
  console.log(`\n▸ Creating GitHub repo: ${GITHUB_OWNER}/${REPO_NAME}`);
  run(`gh repo create ${GITHUB_OWNER}/${REPO_NAME} --public --confirm`, { cwd: MONOREPO });
}

// ── Step 2: Scaffold the project ─────────────────────────────────────────────

function scaffoldProject() {
  console.log('\n▸ Scaffolding standalone Astro project');

  if (!dryRun) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  // ── package.json ──
  const pkg = JSON.parse(readFileSync(join(MONOREPO, 'package.json'), 'utf-8'));
  const standalonePkg = {
    name: REPO_NAME,
    type: 'module',
    version: '0.0.1',
    scripts: pkg.scripts,
    dependencies: { ...pkg.dependencies },
  };
  writeOut('package.json', JSON.stringify(standalonePkg, null, 2) + '\n');

  // ── astro.config.mjs (no base path for standalone) ──
  writeOut('astro.config.mjs', `// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
});
`);

  // ── tsconfig.json ──
  writeOut('tsconfig.json', JSON.stringify({
    extends: 'astro/tsconfigs/strict',
    include: ['.astro/types.d.ts', '**/*'],
    exclude: ['dist'],
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@schema': ['src/schema/content'],
        '@data/*': ['src/data/*'],
      },
    },
  }, null, 2) + '\n');

  // ── Schema files ──
  console.log('\n▸ Copying schema files');
  const schemaDir = join(MONOREPO, 'schema');
  for (const file of readdirSync(schemaDir)) {
    copyFile(join(schemaDir, file), join('schema', file));
  }
  copyFile(join(MONOREPO, 'src', 'schema', 'content.ts'), 'src/schema/content.ts');

  // ── Data file: rename to site.ts ──
  console.log('\n▸ Copying data file → src/data/site.ts');
  const dataContent = readFileSync(DATA_FILE, 'utf-8');
  writeOut('src/data/site.ts', dataContent);

  // ── Page file: becomes src/pages/index.astro ──
  console.log('\n▸ Copying page → src/pages/index.astro');
  let pageContent = readFileSync(PAGE_FILE, 'utf-8');

  // Fix import path: ../../data/{slug} → ../data/site
  pageContent = pageContent.replace(
    /from\s+['"]\.\.\/\.\.\/data\/[^'"]+['"]/g,
    `from '../data/site'`
  );

  // Fix image paths: remove the slug subdirectory
  // images/{imageSlug}/ → images/
  const imgPattern = new RegExp(`images/${imageSlug}/`, 'g');
  pageContent = pageContent.replace(imgPattern, 'images/');

  writeOut('src/pages/index.astro', pageContent);

  // ── Images: flatten into public/images/ ──
  console.log('\n▸ Copying images');
  if (existsSync(IMAGE_DIR)) {
    for (const file of readdirSync(IMAGE_DIR)) {
      copyFile(join(IMAGE_DIR, file), join('public', 'images', file));
    }
  }

  // ── Admin pages ──
  console.log('\n▸ Copying admin pages');
  copyFile(
    join(MONOREPO, 'src', 'pages', 'admin', 'login.astro'),
    'src/pages/admin/login.astro'
  );

  // Copy admin/index.astro (it auto-detects single-site mode)
  copyFile(
    join(MONOREPO, 'src', 'pages', 'admin', 'index.astro'),
    'src/pages/admin/index.astro'
  );

  // ── API routes ──
  console.log('\n▸ Copying API routes');
  const apiFiles = ['auth.ts', 'chat.ts', 'site.ts', 'history.ts', 'upload.ts'];
  for (const file of apiFiles) {
    const src = join(MONOREPO, 'src', 'pages', 'api', file);
    if (existsSync(src)) {
      copyFile(src, join('src', 'pages', 'api', file));
    }
  }

  // ── lib/github.ts — rewrite REPO constant ──
  console.log('\n▸ Copying lib/github.ts (with updated repo)');
  let githubLib = readFileSync(join(MONOREPO, 'src', 'lib', 'github.ts'), 'utf-8');
  githubLib = githubLib.replace(
    /const REPO = ['"]dberget\/site-engine['"]/,
    `const REPO = '${GITHUB_OWNER}/${REPO_NAME}'`
  );
  writeOut('src/lib/github.ts', githubLib);

  // ── Static assets ──
  console.log('\n▸ Copying static assets');
  const faviconSvg = join(MONOREPO, 'public', 'favicon.svg');
  const faviconIco = join(MONOREPO, 'public', 'favicon.ico');
  if (existsSync(faviconSvg)) copyFile(faviconSvg, 'public/favicon.svg');
  if (existsSync(faviconIco)) copyFile(faviconIco, 'public/favicon.ico');
}

// ── Step 3: Git init, commit, and push ───────────────────────────────────────

function gitInitAndPush() {
  console.log('\n▸ Initializing git and pushing');
  run('git init', { cwd: OUT_DIR });
  run('git add -A', { cwd: OUT_DIR });
  run('git commit -m "Initial standalone site from site-engine"', { cwd: OUT_DIR });
  run('git branch -M main', { cwd: OUT_DIR });
  run(`git remote add origin https://github.com/${GITHUB_OWNER}/${REPO_NAME}.git`, { cwd: OUT_DIR });
  run('git push -u origin main', { cwd: OUT_DIR });
}

// ── Step 4: Deploy to Vercel ─────────────────────────────────────────────────

function deployToVercel() {
  console.log('\n▸ Deploying to Vercel');
  run('vercel --yes --prod', { cwd: OUT_DIR });
  run('vercel analytics enable', { cwd: OUT_DIR });

  if (domain) {
    console.log(`\n▸ Adding custom domain: ${domain}`);
    run(`vercel domains add ${domain}`, { cwd: OUT_DIR });
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`\n╔══════════════════════════════════════════╗`);
console.log(`║  Site Engine — Client Provisioning        ║`);
console.log(`╚══════════════════════════════════════════╝`);
console.log(`  Slug:     ${slug}`);
console.log(`  Repo:     ${GITHUB_OWNER}/${REPO_NAME}`);
console.log(`  Domain:   ${domain || '(none)'}`);
console.log(`  Output:   ${OUT_DIR}`);
console.log(`  Dry run:  ${dryRun ? 'YES' : 'no'}`);

validate();

if (dryRun) {
  console.log('\n── DRY RUN: showing what would happen ──\n');
}

createGitHubRepo();
scaffoldProject();
gitInitAndPush();
deployToVercel();

console.log('\n✓ Done!');
if (dryRun) {
  console.log('  (Dry run — no files were written or commands executed)');
} else {
  console.log(`  Repo: https://github.com/${GITHUB_OWNER}/${REPO_NAME}`);
  if (domain) {
    console.log(`  Domain: https://${domain}`);
  }
}
