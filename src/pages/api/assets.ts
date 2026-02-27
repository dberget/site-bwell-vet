export const prerender = false;

import type { APIRoute } from 'astro';
import { getFile, putFile } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

// Slot definitions - maps to data file fields
const SLOT_DEFS = [
  { id: 'heroImage', label: 'Hero Background', path: 'business.heroImage' },
  { id: 'logo', label: 'Logo', path: 'business.logo' },
  { id: 'aboutImage', label: 'About Photo', path: 'business.aboutImage' },
];

// Parse image directory from existing paths in data
function getImageDir(content: string, slug: string): string {
  const match = content.match(/['"]\/images\/([^/'"]+)\//);
  if (match) return match[1];
  // Fallback: derive from slug (northside-collision -> northside)
  return slug.split('-')[0];
}

// Extract current value from data file using regex
function getFieldValue(content: string, fieldPath: string): string | null {
  const parts = fieldPath.split('.');
  if (parts[0] === 'business') {
    const field = parts[1];
    const regex = new RegExp(`${field}:\\s*['"]([^'"]+)['"]`);
    const match = content.match(regex);
    return match ? match[1] : null;
  }
  if (parts[0] === 'gallery') {
    const idx = parseInt(parts[1]);
    const galleryMatch = content.match(/gallery:\s*\[([\s\S]*?)\]/);
    if (galleryMatch) {
      const items = galleryMatch[1].split(/\},\s*\{/);
      if (items[idx]) {
        const srcMatch = items[idx].match(/src:\s*['"]([^'"]+)['"]/);
        return srcMatch ? srcMatch[1] : null;
      }
    }
  }
  return null;
}

// Update field value in data file
function setFieldValue(content: string, fieldPath: string, value: string | null): string {
  const parts = fieldPath.split('.');
  if (parts[0] === 'business') {
    const field = parts[1];
    const regex = new RegExp(`(${field}:\\s*)['"][^'"]*['"]`);
    if (value) {
      if (content.match(regex)) {
        return content.replace(regex, `$1'${value}'`);
      } else {
        // Add field to business object
        return content.replace(/(business:\s*\{)/, `$1\n    ${field}: '${value}',`);
      }
    } else {
      // Remove field
      return content.replace(new RegExp(`\\s*${field}:\\s*['"][^'"]*['"],?`), '');
    }
  }
  // Gallery handling would be more complex - skip for now
  return content;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const ghToken = import.meta.env.GITHUB_TOKEN || '';
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    ghToken
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const branch = url.searchParams.get('branch') || undefined;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
  }

  try {
    // Read data file
    const dataPath = `src/data/${slug}.ts`;
    const file = await getFile(dataPath, ghToken, branch);
    const content = file.content;
    const imageDir = getImageDir(content, slug);

    // Build slots with current values
    const slots = SLOT_DEFS.map(def => ({
      ...def,
      currentImage: getFieldValue(content, def.path),
    }));

    // Get gallery items
    const galleryMatch = content.match(/gallery:\s*\[([\s\S]*?)\]/);
    if (galleryMatch) {
      const galleryContent = galleryMatch[1];
      const itemMatches = galleryContent.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][^}]*src:\s*['"]([^'"]+)['"][^}]*\}/g);
      let idx = 0;
      for (const match of itemMatches) {
        slots.push({
          id: `gallery.${idx}`,
          label: `Gallery ${idx + 1}`,
          path: `gallery.${idx}.src`,
          currentImage: match[2],
        });
        idx++;
      }
    }

    // List all images in the directory
    const listUrl = `https://api.github.com/repos/dberget/site-engine/contents/public/images/${imageDir}`;
    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${ghToken}` },
    });
    
    let allImages: string[] = [];
    if (listRes.ok) {
      const files = await listRes.json();
      allImages = files
        .filter((f: any) => f.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
        .map((f: any) => `/images/${imageDir}/${f.name}`);
    }

    // Find unassigned images
    const assignedImages = slots.map(s => s.currentImage).filter(Boolean);
    const unassigned = allImages.filter(img => !assignedImages.includes(img));

    return new Response(JSON.stringify({ slots, unassigned, imageDir }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const ghToken = import.meta.env.GITHUB_TOKEN || '';
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    ghToken
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, slug, slotId, imageUrl, branch } = body;

    if (!slug || !action) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const dataPath = `src/data/${slug}.ts`;
    const file = await getFile(dataPath, ghToken, branch);
    let content = file.content;

    if (action === 'assign' && slotId && imageUrl) {
      const slot = SLOT_DEFS.find(s => s.id === slotId);
      if (slot) {
        content = setFieldValue(content, slot.path, imageUrl);
      }
    } else if (action === 'unassign' && slotId) {
      const slot = SLOT_DEFS.find(s => s.id === slotId);
      if (slot) {
        content = setFieldValue(content, slot.path, null);
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    const result = await putFile(dataPath, content, `Update ${slotId} image`, file.sha, ghToken, branch);

    return new Response(JSON.stringify({ ok: true, commitSha: result.commitSha }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
