/**
 * Every internal URL in one place. Components never hard-code paths.
 *
 * Paths are built from the site's base path, so the site works both at a
 * domain root ("/") and under a sub-path such as "/my-repo/" on GitHub Pages.
 */
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

/** Path to a file in `public/`, e.g. asset('favicon.svg'). */
export function asset(path: string): string {
  return `${base}${path}`;
}

export const routes = {
  home: base,
  inventory: `${base}inventory/`,
  services: `${base}services/`,
  about: `${base}about/`,
  faq: `${base}faq/`,
  contact: `${base}contact/`,
  privacy: `${base}privacy/`,
} as const;

export function productRoute(slug: string): string {
  return `${routes.inventory}${slug}/`;
}

export function categoryRoute(categoryId: string): string {
  return `${routes.inventory}?category=${encodeURIComponent(categoryId)}`;
}

/** Contact page with the form pre-filled for a specific inventory item. */
export function itemInquiryRoute(productName: string): string {
  return `${routes.contact}?topic=item&item=${encodeURIComponent(productName)}`;
}

export function serviceInquiryRoute(serviceId: string): string {
  return `${routes.contact}?topic=${encodeURIComponent(serviceId)}`;
}
