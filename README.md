# Brock Guns and Repair LLC — Website

Mobile-first marketing and inventory website for Brock Guns and Repair LLC (owner: David Johnson, Texas). Built with [Astro](https://astro.build) and TypeScript as a static, multi-page site with almost no client-side JavaScript.

The visual design is a faithful implementation of the approved Claude Design canvas. This phase is **frontend only**: there is no checkout, no backend, and all inventory is clearly labelled demonstration data.

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev        # development server at http://localhost:4321
```

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server with hot reload                                |
| `npm run build`        | Build the static site into `dist/`                                  |
| `npm run preview`      | Serve the built site locally                                        |
| `npm run check`        | Type-check `.astro` and `.ts` files (`astro check`)                 |
| `npm run lint`         | ESLint (TypeScript, Astro, and accessibility rules)                 |
| `npm run format`       | Format everything with Prettier                                     |
| `npm run format:check` | Verify formatting without changing files                            |
| `npm run test:links`   | Check every internal link and anchor in `dist/` (run after a build) |
| `npm run verify`       | All of the above checks plus a build, in one command                |

Optional environment variables are documented in `.env.example`.

## Publishing to GitHub Pages

Pushing to `main` builds and publishes the site through `.github/workflows/deploy.yml`.

One-time setup: in the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. After the next push, the site URL appears under Settings → Pages and on the workflow run.

The workflow detects the address automatically, including the `/<repo-name>/` sub-path GitHub uses for project sites, and passes it to the build as `SITE_URL` and `BASE_PATH`. Internal links are built from that base in `src/config/routes.ts`, so always use `routes.*` (never a hard-coded `/path/`) when linking. To preview a sub-path build locally:

```bash
BASE_PATH=/my-repo npm run build && BASE_PATH=/my-repo npm run test:links && npm run preview
```

The project folder must be the root of the repository (so `.github/` and `package.json` sit at the top level), and `package-lock.json` must be committed.

## Architecture in one minute

Data flows in one direction, and each layer has one job:

```
src/data/*.ts            content and business facts (plain typed objects)
      │
src/lib/products/        data access: the ProductRepository interface
                         (local records now, REST API later)
      │
src/pages/*.astro        routes: fetch data, compose section components
      │
src/components/**        presentation only: receive typed props, render HTML
      │
src/styles/tokens.css    design tokens used by every component's scoped CSS
```

- **Pages** only import a layout and section components, fetch data, and pass it down as props. The longest page file is about 40 lines.
- **Components** never fetch data and never know where it came from.
- **Styles** live inside the component they describe (Astro scoped styles). Global CSS is limited to tokens, a reset, base typography, form-control basics and two utilities.
- **Client-side scripts** live in `src/scripts/` as small TypeScript modules, separate from markup. They enhance server-rendered HTML through `data-*` attributes.

## Directory structure

```
src/
├── pages/                 One file per route (file-based routing)
│   ├── index.astro            /
│   ├── inventory/index.astro  /inventory/
│   ├── inventory/[slug].astro /inventory/<product>/   (one page per product)
│   ├── services/index.astro   /services/
│   ├── about.astro  faq.astro  contact.astro  privacy.astro  404.astro
├── layouts/
│   ├── BaseLayout.astro   HTML document shell: <head>, fonts, global CSS
│   └── PageLayout.astro   BaseLayout + skip link + Header + <main> + Footer
├── components/
│   ├── ui/                Level 1 — primitives with no business knowledge
│   │                      (Button, Chip, Badge, Icon, Container, Section,
│   │                      SectionHeading, Grid, Split, Input, Select, …)
│   ├── layout/            Header, BrandLogo, Navigation, MobileNavigation, Footer
│   ├── sections/          Sections shared by several pages (PageHero, ContactCallout)
│   ├── home/              Homepage sections (HomeHero, FeaturedInventory, …)
│   ├── products/          ProductCard, ProductGrid, filters, gallery, details
│   ├── services/  about/  contact/  faq/     Page-specific sections
├── data/                  Content: business.ts, products.ts, services.ts, faqs.ts, …
├── types/                 Shared TypeScript types
├── lib/                   Data access (products/), network calls (api/), formatting
├── scripts/               Client-side behavior (filters, menu, gallery, form)
├── config/                site.ts (site settings) and routes.ts (all URLs)
└── styles/                tokens.css, reset.css, typography.css, forms.css, …
```

## Component conventions

Components sit at four levels. Each level only uses the ones below it.

1. **UI primitives** (`components/ui/`) — generic and reusable; they know nothing about products or the business.
2. **Composite components** — combine primitives into something meaningful (`ProductCard`, `ServiceCard`, `ContactForm`, `Navigation`).
3. **Page sections** — one full band of a page (`HomeHero`, `FeaturedInventory`, `AboutHero`).
4. **Pages** — compose sections inside `PageLayout`.

Rules followed throughout:

- One responsibility per file. Props are typed with an `interface Props` and documented where not obvious.
- A component styles only its own markup. When a parent must size or place a child component, it passes a `class` (every primitive forwards `class` and extra attributes to its root element).
- Layout decisions belong to the component that owns the layout: `ProductGrid` owns columns, `ProductCard` owns the card, `Header` owns the mobile/desktop switch.
- Responsive rules are mobile-first (`min-width` media queries) and sit next to the styles they change. Breakpoints are content-driven: 430, 700, 900 and 1150px.
- `<a>` for navigation, `<button>` for actions. `Button`, `Chip`, `TextLink` and `IconButton` pick the right element automatically: pass `href` and you get a link.

## Common changes

### Update business information

Edit **`src/data/business.ts`**. The phone number, owner name, legal name, tagline, address and hours are read from there by the header, footer, contact page, callouts, FAQ and services page. Change the phone number once and it updates everywhere.

Facts that are not confirmed yet are stored as `pending('…')` rather than guessed. See [Pending content](#pending-content-and-launch-checklist).

### Change colors

Edit **`src/styles/tokens.css`**. For example, to change the accent from antique brass, update `--color-brass`, `--color-brass-light`, `--color-brass-pale` and `--color-brass-dark` (the variants exist so text keeps WCAG AA contrast on light and dark backgrounds). No component contains a hard-coded color.

### Change typography

Also in `tokens.css`: `--font-display` (the shop-sign face, Rye) and `--font-body` (Inter), plus the size scale (`--text-*`). Heading styles built from those tokens are in `src/styles/typography.css` (`.text-h1`, `.text-h2`, `.font-display`, …). The font files are self-hosted through the `@fontsource` packages imported in `BaseLayout.astro`; to change a typeface, swap the package and the token.

### Change all buttons

Edit **`src/components/ui/Button.astro`**. Variants (`primary`, `light`, `outline`, `outline-light`) and sizes are defined there and nowhere else. The pill shape comes from `--radius-pill`.

### Change all product cards

Edit **`src/components/products/ProductCard.astro`** (and its parts: `ProductImage`, `ProductMetadata`, `AvailabilityBadge`, `DemoTag`). The homepage, the inventory catalog and the "More in…" strip all render this one component. Grid columns and spacing are in `ProductGrid.astro`.

### Change the homepage hero

- Text: `homeHero` in **`src/data/home.ts`**.
- Layout: **`src/components/home/HomeHero.astro`** (and `HeroContent`, `HeroActions`, `HeroMedia`).
- Photo: see below.

### Replace a photo placeholder

Every photograph slot uses `components/ui/Photo.astro`, which shows a labelled placeholder until it is given an image. To supply the real photo, add the file under `src/assets/images/` and pass it in. For the hero:

```astro
---
// src/components/home/HomeHero.astro
import heroPhoto from '@/assets/images/hero.jpg';
---

<HeroMedia
  image={{ src: heroPhoto, alt: 'Lever-action rifle on a walnut bench' }}
  brief={homeHero.imageBrief}
/>
```

Astro then generates optimized, responsive image files automatically. Product photos go in the product's `images` array (below).

### Add a product

Add a record to the `products` array at the bottom of **`src/data/products.ts`**. It appears in the catalog, gets its own page at `/inventory/<slug>/`, and (with `featured: true`) shows on the homepage. No page or component needs editing.

```ts
{
  id: 'p-1001',
  slug: 'example-rifle',
  name: 'Example Rifle',
  manufacturer: 'Maker',
  model: 'Model 1',
  category: categoryById('rifles'),
  condition: 'used',
  availability: 'available',
  price: 1250,            // or null to show "Call for price"
  description: 'Short, factual description.',
  specs: [{ label: 'Caliber', value: '.30-30' }],
  images: [{ src: riflePhoto, alt: 'Example rifle, right side', label: 'Full view' }],
  featured: true,
  isDemo: false,          // demo listings are labelled as such in the UI
}
```

Categories are defined in `src/data/categories.ts`.

### Add a page

1. Create `src/pages/your-page.astro` (the file name becomes the URL).
2. Wrap the content in `PageLayout` and compose sections:

   ```astro
   ---
   import PageHero from '@/components/sections/PageHero.astro';
   import { routes } from '@/config/routes';
   import PageLayout from '@/layouts/PageLayout.astro';
   ---

   <PageLayout title="Your Page" description="One-sentence summary for search engines.">
     <PageHero
       heading="Your Page"
       description="…"
       breadcrumbs={[{ label: 'Home', href: routes.home }, { label: 'Your Page' }]}
     />
   </PageLayout>
   ```

3. Add the URL to `src/config/routes.ts`, and to `src/data/navigation.ts` if it belongs in the menu.

### Create a reusable component

1. Decide its level: a generic building block goes in `components/ui/`; something tied to one area goes in that area's folder.
2. Start from this shape:

   ```astro
   ---
   /** One sentence: what this component is for. */
   interface Props {
     title: string;
     class?: string;
   }

   const { title, class: className, ...rest } = Astro.props;
   ---

   <div class:list={['my-component', className]} {...rest}>
     <h3 class="text-title">{title}</h3>
     <slot />
   </div>

   <style>
     .my-component {
       padding: var(--space-6);
       border-radius: var(--radius-xl);
     }
   </style>
   ```

3. Use tokens for every color, size and radius. Reuse `Button`, `Icon`, `SectionHeading` and the other primitives instead of re-creating them.

## Data layer and the future backend

The frontend is independent of the backend. The planned architecture is:

```
Astro frontend  →  REST API (JSON)  →  Java Spring Boot  →  PostgreSQL
```

Spring Boot will be a separate application that owns business logic, validation, authentication, authorization and the database. This project only presents data and handles interaction. **Full plan: [`docs/backend-integration.md`](docs/backend-integration.md).**

What is already in place for that:

- **One data-access interface.** All inventory access goes through `ProductRepository` in `src/lib/products/productRepository.ts` (`listProducts`, `listFeaturedProducts`, `findProductBySlug`, `listRelatedProducts`, `listCategories`, `findCategory`). Today it is implemented by `localProducts.ts`, which reads the local records in `src/data/products.ts`. The methods are already `async`.
- **API-shaped models.** `Product` and `Category` in `src/types/product.ts` are plain JSON-compatible objects (`null` for a missing value), matching the proposed API response.
- **One place for network calls.** `fetch()` is used only inside `src/lib/api/`. It currently holds `inquiries.ts` for the contact form. Components and scripts never call `fetch()` themselves.

Moving inventory to the API means adding `src/lib/api/client.ts` and `products.ts`, writing an `apiProductRepository`, and changing one line in `productRepository.ts`. No page markup or component changes.

## Interactive behavior

| Feature                 | Where                                            | Notes                                                                                                                               |
| ----------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Inventory search/filter | `scripts/inventoryFilters.ts`                    | Filters, sorts and counts the server-rendered cards. Category is kept in the URL (`/inventory/?category=rifles`) so it is linkable. |
| Filter sheet (mobile)   | `products/FilterSheet.astro`                     | Native `<dialog>`: focus trap, Escape and backdrop close come from the browser.                                                     |
| Mobile menu             | `layout/MobileNavigation.astro`, `mobileMenu.ts` | Native `<details>`; works without JavaScript. The script adds Escape and click-outside.                                             |
| FAQ                     | `faq/FAQAccordion.astro`                         | Native `<details>`; no JavaScript.                                                                                                  |
| Product gallery         | `scripts/productGallery.ts`                      | Thumbnail buttons switch the main view.                                                                                             |
| Contact form            | `scripts/contactForm.ts`                         | Validates, then submits. See below.                                                                                                 |

### Contact form

The form never claims a message was sent unless a server confirmed it.

- **No backend yet (current state):** after validation it shows "Nothing was sent. This form is not connected yet" and points to the phone number.
- **To connect it:** set `PUBLIC_CONTACT_FORM_ENDPOINT` (for example `/api/inquiries`) to a URL that accepts a JSON `POST` with `name`, `email`, `phone`, `topic` and `message`, and returns a 2xx status on success. The success and failure messages are already implemented. The server must validate and rate-limit these requests; the form's own checks are only a convenience.

Links such as "Ask About This Item" open the form with the topic and item pre-filled (`/contact/?topic=item&item=…`).

## Pending content and launch checklist

Unverified information is never invented. It is stored as `pending('note')` and rendered by `components/ui/Pending.astro` as a dashed "[TO BE CONFIRMED]" marker, so everything still needed from David is visible on the page.

`showPendingContent` in **`src/config/site.ts`** controls this. Set it to `false` and every marker disappears, FAQ questions with no confirmed answer are dropped, empty specification rows are hidden, and the "unconfirmed services" panel is removed.

Before launch:

- [ ] Confirm address, hours and email in `src/data/business.ts`
- [ ] Replace demo products in `src/data/products.ts` with real inventory (`isDemo: false`) and confirm categories
- [ ] Supply photographs (hero, David's portrait, bench photos, shop sign, products)
- [ ] Fill in David's story (`data/home.ts`, `data/about.ts`), service details (`data/services.ts`) and FAQ answers (`data/faqs.ts`)
- [ ] Confirm the purchase process wording and the privacy text (`pages/privacy.astro`)
- [ ] Connect the contact form endpoint
- [ ] Set `SITE_URL` for canonical URLs, then set `showPendingContent` to `false`
- [ ] Have the owner confirm legal and compliance requirements for firearm sales content before any transactional feature is added

## Accessibility and performance

- Semantic landmarks, one `<h1>` per page, skip link, visible focus ring, 44px touch targets, labelled form fields with inline errors, `prefers-reduced-motion` support.
- Status is never conveyed by color alone (availability uses text plus a shaped marker).
- Static HTML, self-hosted fonts, no UI framework. JavaScript ships only on pages that use it and totals a few kilobytes.

## Notes on design fidelity

- The canvas used container-query units because it was drawn inside artboards; the site uses the equivalent viewport units and the same breakpoints.
- Product cards keep the approved "View Details ›" text affordance (the whole card is one link) rather than a nested button, which would put an interactive control inside a link.
- One intentional deviation for WCAG AA: on sold items only the placeholder icon and photo are dimmed; the label keeps full contrast.
- The privacy and 404 pages were not on the canvas. They are built from the existing components and tokens.
