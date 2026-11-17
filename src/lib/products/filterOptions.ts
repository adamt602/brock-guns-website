import { availabilityLabels, conditionLabels } from './productLabels';
import type { ProductAvailability, ProductCondition } from '@/types/product';

/** Value that means "no filter" for any filter key. */
export const ANY = 'any';

export interface FilterOption {
  value: string;
  label: string;
}

const anyOption: FilterOption = { value: ANY, label: 'Any' };

export const conditionOptions: FilterOption[] = [
  anyOption,
  ...(Object.keys(conditionLabels) as ProductCondition[]).map((value) => ({
    value,
    label: conditionLabels[value],
  })),
];

export const availabilityOptions: FilterOption[] = [
  anyOption,
  ...(Object.keys(availabilityLabels) as ProductAvailability[]).map((value) => ({
    value,
    label: availabilityLabels[value],
  })),
];

export const sortOptions: FilterOption[] = [
  { value: 'featured', label: 'Sort: Featured' },
  { value: 'name-asc', label: 'Sort: Name A to Z' },
  { value: 'name-desc', label: 'Sort: Name Z to A' },
];
