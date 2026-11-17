import { categories } from './categories';
import type { Category, Product, ProductSpec } from '@/types/product';

/**
 * DEMONSTRATION DATA — not real inventory, pricing, or availability.
 *
 * Records use the same plain shape the REST API will return (`null` for a
 * value that has not been supplied).
 *
 * Every record is flagged `isDemo: true`, which makes the UI label it as a
 * demo listing. Replace this file's contents (or swap the repository in
 * `src/lib/products/productRepository.ts`) when real inventory exists.
 */

interface DemoSeed {
  slug: string;
  name: string;
  categoryId: Category['id'];
  condition: Product['condition'];
  availability: Product['availability'];
  specs: ProductSpec[];
  featured?: boolean;
}

const firearmSpecs = (type: string, action: string): ProductSpec[] => [
  { label: 'Type', value: type },
  { label: 'Action', value: action },
  { label: 'Caliber', value: null },
  { label: 'Barrel length', value: null },
  { label: 'Item number', value: null },
];

const accessorySpecs = (type: string): ProductSpec[] => [
  { label: 'Type', value: type },
  { label: 'Item number', value: null },
];

const seeds: DemoSeed[] = [
  {
    slug: 'demo-lever-action-rifle',
    name: 'Demo Lever-Action Rifle',
    categoryId: 'rifles',
    condition: 'used',
    availability: 'available',
    specs: firearmSpecs('Rifle', 'Lever action'),
    featured: true,
  },
  {
    slug: 'demo-revolver',
    name: 'Demo Revolver',
    categoryId: 'handguns',
    condition: 'used',
    availability: 'available',
    specs: firearmSpecs('Handgun', 'Revolver'),
    featured: true,
  },
  {
    slug: 'demo-over-under-shotgun',
    name: 'Demo Over/Under Shotgun',
    categoryId: 'shotguns',
    condition: 'used',
    availability: 'confirm',
    specs: firearmSpecs('Shotgun', 'Break action'),
    featured: true,
  },
  {
    slug: 'demo-bolt-action-rifle',
    name: 'Demo Bolt-Action Rifle',
    categoryId: 'rifles',
    condition: 'new',
    availability: 'confirm',
    specs: firearmSpecs('Rifle', 'Bolt action'),
    featured: true,
  },
  {
    slug: 'demo-semi-automatic-pistol',
    name: 'Demo Semi-Automatic Pistol',
    categoryId: 'handguns',
    condition: 'new',
    availability: 'sold',
    specs: firearmSpecs('Handgun', 'Semi-automatic'),
    featured: true,
  },
  {
    slug: 'demo-pump-action-shotgun',
    name: 'Demo Pump-Action Shotgun',
    categoryId: 'shotguns',
    condition: 'new',
    availability: 'available',
    specs: firearmSpecs('Shotgun', 'Pump action'),
    featured: true,
  },
  {
    slug: 'demo-leather-sling',
    name: 'Demo Leather Sling',
    categoryId: 'accessories',
    condition: 'new',
    availability: 'available',
    specs: accessorySpecs('Sling'),
  },
  {
    slug: 'demo-hard-case',
    name: 'Demo Hard Case',
    categoryId: 'accessories',
    condition: 'new',
    availability: 'confirm',
    specs: accessorySpecs('Case'),
  },
];

function categoryById(id: Category['id']): Category {
  const category = categories.find((candidate) => candidate.id === id);
  if (!category) throw new Error(`Unknown product category: ${id}`);
  return category;
}

export const demoProducts: Product[] = seeds.map((seed, index) => ({
  id: `demo-${index + 1}`,
  slug: seed.slug,
  name: seed.name,
  manufacturer: 'Manufacturer',
  model: null,
  category: categoryById(seed.categoryId),
  condition: seed.condition,
  availability: seed.availability,
  price: null,
  description: null,
  specs: seed.specs,
  images: [],
  featured: seed.featured ?? false,
  isDemo: true,
}));

/**
 * Everything the site lists. Add real products to this array (and remove
 * `...demoProducts` once real inventory replaces the demonstration data).
 */
export const products: Product[] = [...demoProducts];
