// @ts-check
import { defineConfig } from 'astro/config';

// Where the site is published. Both values come from the environment so the
// same code runs at a domain root or under a sub-path:
//   SITE_URL   production origin, e.g. https://example.com (enables canonical URLs)
//   BASE_PATH  sub-path the site is served from, e.g. /my-repo on GitHub Pages
// The GitHub Pages workflow sets both automatically; locally they are unset
// and the site runs at http://localhost:4321/.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
