#!/usr/bin/env node

/**
 * enable-analytics.mjs
 *
 * Enables Vercel Web Analytics for a standalone site project.
 * Installs @vercel/analytics, injects the script into the site's page,
 * then commits and pushes.
 *
 * Usage:
 *   node scripts/enable-analytics.mjs [--project-dir <path>] [--dry-run]
 *
 * If --project-dir is omitted, operates on the current working directory.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    'project-dir': { type: 'string' },
    'dry-run':     { type: 'boolean', default: false },
  },
  strict: true,
});

const projectDir = resolve(args['project-dir'] || process.cwd());
const dryRun = args['dry-run'];

function run(cmd) {
  console.log(`  $ ${cmd}`);
  if (dryRun) return '';
  return execSync(cmd, { encoding: 'utf-8', cwd: projectDir, stdio: 'pipe' }).trim();
}

console.log(`\n▸ Enabling Vercel Web Analytics`);
console.log(`  Project: ${projectDir}`);
console.log(`  Dry run: ${dryRun ? 'YES' : 'no'}\n`);

// ── Step 1: Install @vercel/analytics ────────────────────────────────────────

console.log('▸ Installing @vercel/analytics');
run('npm install @vercel/analytics');

// ── Step 2: Add analytics script to the site page ────────────────────────────

// Look for the main page file
const pageCandidates = [
  'src/pages/index.astro',
];

let targetPage = null;
for (const candidate of pageCandidates) {
  const full = join(projectDir, candidate);
  if (existsSync(full)) {
    targetPage = full;
    break;
  }
}

if (!targetPage) {
  console.error('Error: Could not find a page file to inject analytics into.');
  process.exit(1);
}

console.log(`▸ Injecting analytics into ${targetPage.replace(projectDir, '.')}`);

const ANALYTICS_SNIPPET = `\n    <!-- Vercel Web Analytics -->\n    <script type="module">import { inject } from '@vercel/analytics'; inject();</script>`;

let pageContent = readFileSync(targetPage, 'utf-8');

if (pageContent.includes('@vercel/analytics')) {
  console.log('  Analytics already present — skipping injection.');
} else {
  // Insert before </head> if present, otherwise before </body>
  if (pageContent.includes('</head>')) {
    pageContent = pageContent.replace('</head>', `${ANALYTICS_SNIPPET}\n  </head>`);
  } else if (pageContent.includes('</body>')) {
    pageContent = pageContent.replace('</body>', `${ANALYTICS_SNIPPET}\n  </body>`);
  } else {
    console.error('Error: Could not find </head> or </body> tag to inject analytics.');
    process.exit(1);
  }

  if (!dryRun) {
    writeFileSync(targetPage, pageContent, 'utf-8');
  }
  console.log('  Analytics snippet injected.');
}

// ── Step 3: Commit and push ──────────────────────────────────────────────────

console.log('\n▸ Committing and pushing');
run('git add -A');
run('git commit -m "Enable Vercel Web Analytics"');
run('git push');

console.log('\n✓ Vercel Web Analytics enabled!');
if (dryRun) {
  console.log('  (Dry run — no changes were made)');
}
