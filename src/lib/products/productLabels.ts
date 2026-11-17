import { formatCurrency } from '@/lib/formatting/currency';
import type { Product, ProductAvailability, ProductCondition } from '@/types/product';

/** Display text for product enums, shared by cards, filters and detail pages. */
export const availabilityLabels: Record<ProductAvailability, string> = {
  available: 'Available',
  confirm: 'Confirm availability',
  sold: 'Sold',
};

export const conditionLabels: Record<ProductCondition, string> = {
  new: 'New',
  used: 'Used',
};

export const CALL_FOR_PRICE = 'Call for price';

/** A verified price, or "Call for price" when none has been supplied. */
export function formatProductPrice(product: Pick<Product, 'price'>): string {
  return product.price === null ? CALL_FOR_PRICE : formatCurrency(product.price);
}
