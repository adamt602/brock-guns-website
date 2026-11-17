import type { Category } from '@/types/product';

/** Placeholder categories until the real inventory structure is supplied. */
export const categories: Category[] = [
  { id: 'rifles', label: 'Rifles', singular: 'Rifle' },
  { id: 'handguns', label: 'Handguns', singular: 'Handgun' },
  { id: 'shotguns', label: 'Shotguns', singular: 'Shotgun' },
  { id: 'accessories', label: 'Accessories', singular: 'Accessory' },
];

export const categoriesAreProvisional = true;
