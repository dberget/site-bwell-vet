# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site Engine is an AI-powered website builder SaaS for local businesses. Small business owners manage their sites through a chat interface powered by Claude AI. Built for Lake Country Web Services in central Minnesota.

The entire project lives in `site-engine/`.

## Commands

All commands run from `site-engine/`:

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
```

There are no test or lint scripts configured.

## Architecture

**Framework:** Astro v5 with TypeScript (strict mode), deployed to Vercel via `@astrojs/vercel` adapter (120s max serverless duration).

**Package manager:** npm

### Routing

- `/` — Marketing homepage (`src/pages/index.astro`, large single-file page)
- `/{slug}` — Individual business sites, served two ways:
  - Static directories per site (e.g., `src/pages/becker-auto/`)
  - Dynamic catch-all route: `src/pages/[slug]/[...page].astro` using `getStaticPaths()` from data files
- `/admin` — Chat-based editing panel (`src/pages/admin/`)
- `/pricing` — Pricing page
- `/api/*` — Server-side endpoints (all use `export const prerender = false`)

### Data Layer

Business site content is defined in TypeScript files under `src/data/{slug}.ts`. Each exports `site` (SiteContent), `sections` (SectionDef[]), and optionally `pages` for multi-page sites. The schema is defined in `src/schema/content.ts` — the `SiteContent` interface covers business info, contact, hours, services, team, gallery, testimonials, announcements, and SEO.

**TypeScript path aliases:**
- `@schema` → `src/schema/content`
- `@data/*` → `src/data/*`

### Component System

`SectionRenderer.astro` dynamically renders sections based on `type` from `SectionDef`. Available section types map to components in `src/components/sections/`: Hero, Services, Gallery, Testimonials, About, Contact, Content, CTA, FAQ, Features, PageHeader.

`SiteLayout.astro` is the master layout wrapper with global CSS, theming (CSS custom properties `--primary`, `--accent`), and responsive design via `clamp()`.

### API Endpoints (`src/pages/api/`)

- `chat.ts` — Streams AI page edits via SSE using Claude (claude-sonnet-4-20250514). Reads current Astro files from GitHub, sends to Claude with edit instructions, extracts code blocks from response, commits back to GitHub.
- `auth.ts` — Cookie-based auth (`se_auth` cookie with `ADMIN_SECRET` value)
- `checkout.ts` — Stripe checkout session creation
- `contact.ts` — Lead capture from business site contact forms
- `assets.ts` / `upload.ts` — Image/file upload to GitHub
- `history.ts` — Page edit history from GitHub commits
- `site.ts` — Lists available sites and pages
- `webhook.ts` — Stripe/GitHub webhooks

### Key Integration: GitHub as Database

`src/lib/github.ts` provides the GitHub API layer. GitHub serves as the source of truth for all site content — page files are read/written via the API, images stored as assets, and edit history tracked via commits. Commits to `master` trigger Vercel auto-deployment.

### AI Editing Flow

1. User logs into `/admin` with `ADMIN_SECRET`
2. Selects a site and page in the admin panel
3. Types change requests in the chat interface
4. `api/chat.ts` reads the current page file from GitHub, sends it to Claude with the request
5. Claude returns modified Astro code in a fenced code block
6. System extracts the code block and commits it to GitHub
7. Vercel auto-deploys (~30s)

## Environment Variables

- `ADMIN_SECRET` — Admin auth password
- `GITHUB_TOKEN` — GitHub API access for reading/writing site files
- `ANTHROPIC_API_KEY` — Claude AI for chat editing
- `STRIPE_SECRET_KEY` — Payment processing

## Adding a New Business Site

1. Create `src/data/{slug}.ts` exporting `site`, `sections`, and optionally `pages`
2. Follow the `SiteContent` schema from `src/schema/content.ts`
3. The dynamic route `[slug]/[...page].astro` auto-discovers it via `getStaticPaths()`
