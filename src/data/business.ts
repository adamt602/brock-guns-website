import type { BusinessInfo } from '@/types/business';
import { pending } from '@/types/content';

/**
 * Verified facts about the business — the one place to update them.
 * Anything not yet confirmed with David is marked `pending(...)`, never guessed.
 */
export const business: BusinessInfo = {
  legalName: 'Brock Guns and Repair LLC',
  wordmark: { primary: 'Brock Guns', secondary: 'Repair' },
  owner: { name: 'David Johnson', firstName: 'David', title: 'Owner' },
  phone: { display: '(817) 550-1755', e164: '+18175501755' },
  region: 'Texas',
  address: pending('STREET ADDRESS AND CITY: TO BE CONFIRMED'),
  hours: pending('HOURS: TO BE CONFIRMED'),
  email: pending('EMAIL: TO BE CONFIRMED'),
  tagline: 'Firearm sales in Texas, with gunsmithing and repair services. Owned by David Johnson.',
  scripture: 'Psalm 18:39 (NKJV)',
};

/** Company name without the legal suffix, for running copy. */
export const businessName = business.legalName.replace(/ LLC$/, '');

export const phoneHref = `tel:${business.phone.e164}`;
