// Verifies that every internal link and anchor in the built site resolves.
// Usage: npm run build && npm run test:links
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

// When the site is built for a sub-path (BASE_PATH=/my-repo), every internal
// link must start with it; the prefix is removed to find the file in dist/.
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run "npm run build" first.');
  process.exit(1);
}

/** @returns {string[]} */
function htmlFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return path.endsWith('.html') ? [path] : [];
  });
}

/** Maps a URL path to the file Astro generated for it. */
function fileForPath(pathname) {
  const clean = decodeURIComponent(pathname);
  const candidates = [join(DIST, clean, 'index.html'), join(DIST, clean)];
  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

const idCache = new Map();
function idsIn(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  }
  return idCache.get(file);
}

const problems = [];
let checked = 0;

for (const file of htmlFiles(DIST)) {
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');

  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    if (/^(tel:|mailto:|https?:)/.test(href)) continue;
    checked += 1;

    const url = new URL(href.replaceAll('&amp;', '&'), `http://site${BASE}${page}`);
    if (!url.pathname.startsWith(`${BASE}/`)) {
      problems.push(`${page}: link ignores the base path: ${href}`);
      continue;
    }
    const target = fileForPath(url.pathname.slice(BASE.length));
    if (!target) {
      problems.push(`${page}: broken link ${href}`);
      continue;
    }
    if (url.hash && !idsIn(target).has(decodeURIComponent(url.hash.slice(1)))) {
      problems.push(`${page}: missing anchor ${href}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} link problem(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`OK: ${checked} internal links checked, all resolve.`);
