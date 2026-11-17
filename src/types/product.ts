import type { ImageMetadata } from 'astro';

/*
 * Product models. These mirror the JSON the future REST API will return
 * (see docs/backend-integration.md), so they hold plain values only:
 * a missing value is `null`, never a UI-specific object.
 */

export type ProductCondition = 'new' | 'used';
export type ProductAvailability = 'available' | 'confirm' | 'sold';

export interface Category {
  id: string;
  /** Plural label used in navigation and filters, e.g. "Rifles". */
  label: string;
  /** Singular label used on a product, e.g. "Rifle". */
  singular: string;
}

export interface ProductImage {
  /** An image URL (what the API returns), or a local optimized asset. */
  src: string | ImageMetadata;
  alt: string;
  /** Short caption for the gallery, e.g. "Left side". */
  label?: string;
}

export interface ProductSpec {
  label: string;
  /** `null` when the value has not been supplied. */
  value: string | null;
}

export interface Product {
  id: string;
  /** URL segment: /inventory/<slug>/ */
  slug: string;
  name: string;
  manufacturer: string;
  model: string | null;
  category: Category;
  condition: ProductCondition;
  availability: ProductAvailability;
  /** Verified price in US dollars (e.g. 1249.99), or `null` to show "Call for price". */
  price: number | null;
  description: string | null;
  specs: ProductSpec[];
  images: ProductImage[];
  featured: boolean;
  /** True for demonstration listings that are not real inventory. */
  isDemo: boolean;
}
