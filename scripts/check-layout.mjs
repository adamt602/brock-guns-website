// Renders the built site in a real browser and checks the product-card layout
// at a range of widths. Usage: npm run build && npm run test:layout
// (first time only: npx playwright install chromium)
import { preview } from 'astro';
import { chromium } from 'playwright';

// Includes the widths where the column count changes, where cards are narrowest.
const WIDTHS = [320, 390, 430, 599, 600, 768, 900, 1024, 1150, 1440];
const COLUMNS = (width) => (width < 600 ? 1 : width < 900 ? 2 : width < 1150 ? 3 : 4);
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

const server = await preview({ logLevel: 'silent' });
const origin = `http://localhost:${server.port}${BASE}`;
const browser = await chromium.launch();
const problems = [];

/** Runs in the page: measures every product card inside `listSelector`. */
function measureCards(listSelector) {
  const overlaps = (a, b) =>
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const inside = (inner, outer) =>
    inner.left >= outer.left - 0.5 &&
    inner.right <= outer.right + 0.5 &&
    inner.top >= outer.top - 0.5 &&
    inner.bottom <= outer.bottom + 0.5;

  const cards = [...document.querySelectorAll(`${listSelector} .product-card`)].filter(
    (card) => card.getBoundingClientRect().width > 0,
  );
  return {
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    columns: new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left))).size,
    cards: cards.map((card) => {
      const rect = (selector) => card.querySelector(selector)?.getBoundingClientRect();
      const image = rect('.product-image');
      const tag = rect('.demo-tag');
      const pill = rect('.availability');
      const name = card.querySelector('.product-meta__name');
      const price = rect('.product-card__price');
      const action = rect('.product-card__action');
      return {
        name: name.textContent.trim(),
        badgesOverlap: Boolean(tag && pill && overlaps(tag, pill)),
        badgesOnOneRow: !tag || !pill || Math.abs(tag.top - pill.top) < 4,
        badgesInsideImage: [tag, pill].every((badge) => !badge || inside(badge, image)),
        nameTruncated: name.scrollHeight > name.clientHeight + 1,
        priceRowOnOneLine:
          Math.abs(price.top + price.height / 2 - (action.top + action.height / 2)) < 4,
        imageRatio: image.width / image.height,
      };
    }),
  };
}

try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const report = (message) => problems.push(`${width}px: ${message}`);

    // Inventory catalog
    await page.goto(`${origin}/inventory/`, { waitUntil: 'networkidle' });
    const catalog = await page.evaluate(measureCards, '[data-product-list]');
    const singleColumn = COLUMNS(width) === 1;

    if (catalog.pageOverflow > 0) report('inventory page scrolls horizontally');
    if (catalog.columns !== COLUMNS(width)) {
      report(`inventory has ${catalog.columns} columns, expected ${COLUMNS(width)}`);
    }
    for (const card of catalog.cards) {
      if (card.badgesOverlap) report(`badges overlap on "${card.name}"`);
      if (!card.badgesInsideImage) report(`a badge leaves the image on "${card.name}"`);
      if (!card.badgesOnOneRow) report(`badges wrap onto two rows on "${card.name}"`);
      if (singleColumn && card.nameTruncated) report(`name is truncated: "${card.name}"`);
      if (singleColumn && !card.priceRowOnOneLine) report(`price row wraps on "${card.name}"`);
      const expectedRatio = singleColumn ? 3 / 2 : 4 / 3;
      if (Math.abs(card.imageRatio - expectedRatio) > 0.02) {
        report(`image ratio is ${card.imageRatio.toFixed(2)} on "${card.name}"`);
      }
    }

    // "More in…" strip on a product page
    await page.goto(`${origin}/inventory/demo-lever-action-rifle/`, { waitUntil: 'networkidle' });
    const related = await page.evaluate(measureCards, '.product-grid--carousel');
    if (related.pageOverflow > 0) report('product page scrolls horizontally');
    if (related.cards.length === 0) report('no related products found');
    for (const card of related.cards) {
      if (card.badgesOverlap) report(`badges overlap on related "${card.name}"`);
      if (!card.badgesInsideImage) report(`a badge leaves the image on related "${card.name}"`);
    }

    await page.close();
  }
} finally {
  await browser.close();
  await server.stop();
}

if (problems.length > 0) {
  console.error(`${problems.length} layout problem(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`OK: product card layout verified at ${WIDTHS.join(', ')}px.`);
