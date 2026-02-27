#!/usr/bin/env node

/**
 * scrape-helper.js — HTML parsing helper for the scrape-site agent.
 *
 * Usage:
 *   node scripts/scrape-helper.js discover <url>        — Find pages on a site
 *   node scripts/scrape-helper.js fetch <url>            — Parse a single page
 *   node scripts/scrape-helper.js download-image <url> <output-path>  — Download an image
 */

import { parse as parseHTML } from 'node-html-parser';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

const args = process.argv.slice(2);
const action = args[0];

if (!action) {
  console.error('Usage: node scripts/scrape-helper.js <discover|fetch|download-image> <url> [output-path]');
  process.exit(1);
}

// ── Fetch with timeout and error handling ──

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteEngine/1.0; +https://siteengine.io)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ── Normalize URL ──

function normalizeUrl(href, baseUrl) {
  try {
    const url = new URL(href, baseUrl);
    // Strip hash and trailing slash
    url.hash = '';
    let path = url.pathname.replace(/\/+$/, '') || '/';
    return `${url.origin}${path}${url.search}`;
  } catch {
    return null;
  }
}

function isSameDomain(url, baseUrl) {
  try {
    return new URL(url).hostname === new URL(baseUrl).hostname;
  } catch {
    return false;
  }
}

// ── Classify a page by its URL path ──

function classifyPage(url) {
  const path = new URL(url).pathname.toLowerCase();
  if (path === '/' || path === '') return 'home';
  if (/about|our-story|who-we-are|history/.test(path)) return 'about';
  if (/service|what-we-do|offerings/.test(path)) return 'services';
  if (/contact|reach|location|find-us|directions/.test(path)) return 'contact';
  if (/gallery|photos|portfolio|projects|our-work/.test(path)) return 'gallery';
  if (/team|staff|people|crew|meet/.test(path)) return 'team';
  if (/faq|questions|help/.test(path)) return 'faq';
  if (/testimonial|review/.test(path)) return 'testimonials';
  return 'other';
}

// Skip irrelevant pages
function shouldSkipPage(url) {
  const path = new URL(url).pathname.toLowerCase();
  return /\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip)$/i.test(path) ||
    /blog\/\d|\/post\/|\/article\/|\/news\/\d/.test(path) ||
    /privacy|terms|cookie|legal|sitemap|login|signup|cart|checkout|wp-admin|wp-login|feed|rss/.test(path);
}

// ── Strip non-content elements from HTML ──

function stripNonContent(root) {
  const selectors = ['script', 'style', 'noscript', 'svg', 'iframe', 'link', 'meta', 'nav', 'footer', 'header'];
  for (const sel of selectors) {
    for (const el of root.querySelectorAll(sel)) {
      el.remove();
    }
  }
  return root;
}

// ── Extract metadata ──

function extractMetadata(root, html) {
  const getMeta = (name) => {
    const el = root.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return el ? el.getAttribute('content') : null;
  };

  const title = root.querySelector('title')?.text?.trim() || '';

  // Try to extract colors from inline CSS
  const colors = [];
  const colorRegex = /#[0-9a-fA-F]{6}\b/g;
  const styleBlocks = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  for (const block of styleBlocks) {
    const matches = block.match(colorRegex) || [];
    colors.push(...matches);
  }

  return {
    title,
    description: getMeta('description') || '',
    ogImage: getMeta('og:image') || '',
    ogTitle: getMeta('og:title') || '',
    ogDescription: getMeta('og:description') || '',
    colors: [...new Set(colors)].slice(0, 10),
  };
}

// ── Extract images ──

function extractImages(root, baseUrl) {
  const images = [];
  const seen = new Set();
  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    if (!src) continue;

    const absUrl = normalizeUrl(src, baseUrl);
    if (!absUrl || seen.has(absUrl)) continue;
    seen.add(absUrl);

    // Skip tiny/tracking pixels and common non-content patterns
    const width = parseInt(img.getAttribute('width') || '0');
    const height = parseInt(img.getAttribute('height') || '0');
    if ((width > 0 && width < 50) || (height > 0 && height < 50)) continue;
    if (/pixel|tracking|beacon|spacer|1x1|transparent|blank/i.test(absUrl)) continue;
    if (/gravatar|facebook\.com\/tr|google-analytics/i.test(absUrl)) continue;

    images.push({
      src: absUrl,
      alt: img.getAttribute('alt') || '',
      width: width || null,
      height: height || null,
    });
  }

  // Also check background images in style attributes
  for (const el of root.querySelectorAll('[style]')) {
    const style = el.getAttribute('style') || '';
    const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    if (bgMatch) {
      const absUrl = normalizeUrl(bgMatch[1], baseUrl);
      if (absUrl && !seen.has(absUrl) && !/gradient|data:/.test(bgMatch[1])) {
        seen.add(absUrl);
        images.push({ src: absUrl, alt: '', width: null, height: null, fromBackground: true });
      }
    }
  }

  return images;
}

// ── Extract contact info ──

function extractContactInfo(text) {
  const phones = [];
  // Match common US phone formats
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phoneMatches = text.match(phoneRegex) || [];
  for (const p of phoneMatches) {
    const cleaned = p.replace(/\D/g, '');
    if (cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))) {
      phones.push(p.trim());
    }
  }

  const emails = [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = text.match(emailRegex) || [];
  for (const e of emailMatches) {
    if (!/\.(png|jpg|gif|svg|webp)$/i.test(e)) {
      emails.push(e.toLowerCase());
    }
  }

  return {
    phones: [...new Set(phones)],
    emails: [...new Set(emails)],
  };
}

// ── Extract social links ──

function extractSocialLinks(root, baseUrl) {
  const socials = {};
  const links = root.querySelectorAll('a[href]');
  for (const a of links) {
    const href = a.getAttribute('href') || '';
    if (/facebook\.com/i.test(href) && !/sharer/i.test(href)) socials.facebook = href;
    else if (/instagram\.com/i.test(href)) socials.instagram = href;
    else if (/twitter\.com|x\.com/i.test(href) && !/intent/i.test(href)) socials.twitter = href;
    else if (/linkedin\.com/i.test(href) && !/share/i.test(href)) socials.linkedin = href;
    else if (/youtube\.com|youtu\.be/i.test(href)) socials.youtube = href;
    else if (/nextdoor\.com/i.test(href)) socials.nextdoor = href;
    else if (/yelp\.com/i.test(href)) socials.yelp = href;
  }
  return socials;
}

// ── Extract hours patterns ──

function extractHours(text) {
  const patterns = [];
  // Match common patterns like "Monday - Friday: 8:00 AM - 5:00 PM"
  const hoursRegex = /(?:mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:rs(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)\s*[-–—through]*\s*(?:mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:rs(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)?\s*:?\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[-–—to]+\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi;
  const matches = text.match(hoursRegex) || [];
  for (const m of matches) {
    patterns.push(m.trim());
  }

  // Also match "Open 24 hours", "Closed Sunday", etc.
  const statusRegex = /(?:open|closed)\s+(?:24\s*hours?|mon(?:day)?|tue(?:s(?:day)?)?|wed(?:nesday)?|thu(?:rs(?:day)?)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?)/gi;
  const statusMatches = text.match(statusRegex) || [];
  for (const m of statusMatches) {
    patterns.push(m.trim());
  }

  return patterns;
}

// ── Extract address ──

function extractAddress(text) {
  // Match US address patterns
  const addressRegex = /\d{1,5}\s+[\w\s.]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|circle|cir|highway|hwy|route|rt)\.?\s*(?:#?\s*\w+)?,?\s*[\w\s]+,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?/gi;
  const matches = text.match(addressRegex) || [];
  return matches.map(m => m.trim());
}

// ──────────────────────────────────────
// ACTION: discover
// ──────────────────────────────────────

async function discover(url) {
  const html = await fetchPage(url);
  const root = parseHTML(html);

  const metadata = extractMetadata(root, html);
  const links = root.querySelectorAll('a[href]');
  const seen = new Set();
  const pages = [];

  // Always include the homepage
  const homeUrl = normalizeUrl('/', url);
  seen.add(homeUrl);
  pages.push({ url: homeUrl, title: metadata.title, type: 'home' });

  for (const a of links) {
    const href = a.getAttribute('href');
    if (!href) continue;

    const absUrl = normalizeUrl(href, url);
    if (!absUrl || seen.has(absUrl) || !isSameDomain(absUrl, url)) continue;
    if (shouldSkipPage(absUrl)) continue;

    seen.add(absUrl);
    const type = classifyPage(absUrl);
    const title = a.text?.trim() || '';
    pages.push({ url: absUrl, title, type });
  }

  // Sort: prioritize known types over 'other'
  const priority = { home: 0, about: 1, services: 2, contact: 3, gallery: 4, team: 5, testimonials: 6, faq: 7, other: 8 };
  pages.sort((a, b) => (priority[a.type] ?? 99) - (priority[b.type] ?? 99));

  console.log(JSON.stringify({ metadata, pages: pages.slice(0, 15) }, null, 2));
}

// ──────────────────────────────────────
// ACTION: fetch
// ──────────────────────────────────────

async function fetchAndParse(url) {
  const html = await fetchPage(url);
  const root = parseHTML(html);
  const metadata = extractMetadata(root, html);

  // Extract data before stripping elements
  const images = extractImages(root, url);
  const socials = extractSocialLinks(root, url);

  // Get full text for pattern extraction
  const fullText = root.text.replace(/\s+/g, ' ').trim();
  const contactInfo = extractContactInfo(fullText);
  const hours = extractHours(fullText);
  const addresses = extractAddress(fullText);

  // Strip non-content for cleaner text extraction
  const cleaned = stripNonContent(root);
  const text = cleaned.text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
    .slice(0, 15000); // Cap text length

  console.log(JSON.stringify({
    url,
    metadata,
    text,
    images,
    contactInfo,
    socials,
    hours,
    addresses,
  }, null, 2));
}

// ──────────────────────────────────────
// ACTION: download-image
// ──────────────────────────────────────

async function downloadImage(imageUrl, outputPath) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteEngine/1.0; +https://siteengine.io)',
        'Accept': 'image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, buffer);

    console.log(JSON.stringify({
      success: true,
      path: outputPath,
      size: buffer.length,
      contentType: res.headers.get('content-type') || 'unknown',
    }));
  } catch (err) {
    console.log(JSON.stringify({
      success: false,
      error: err.message,
      url: imageUrl,
    }));
  } finally {
    clearTimeout(timeout);
  }
}

// ── Main dispatch ──

try {
  switch (action) {
    case 'discover':
      if (!args[1]) { console.error('Usage: discover <url>'); process.exit(1); }
      await discover(args[1]);
      break;
    case 'fetch':
      if (!args[1]) { console.error('Usage: fetch <url>'); process.exit(1); }
      await fetchAndParse(args[1]);
      break;
    case 'download-image':
      if (!args[1] || !args[2]) { console.error('Usage: download-image <url> <output-path>'); process.exit(1); }
      await downloadImage(args[1], args[2]);
      break;
    default:
      console.error(`Unknown action: ${action}`);
      process.exit(1);
  }
} catch (err) {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
}
