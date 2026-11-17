import { pending } from '@/types/content';

/** Homepage copy. Edit text here; layout lives in `src/components/home/`. */
export const homeHero = {
  eyebrow: 'Firearm sales · Texas',
  headingLead: 'Texas Heritage.',
  headingAccent: 'Modern Service.',
  description:
    'Browse inventory information and connect directly with David Johnson for personalized service.',
  primaryAction: 'Browse Inventory',
  secondaryAction: 'Contact David',
  imageBrief: 'A single firearm on a clean neutral surface, soft studio light',
};

export const featuredInventory = {
  heading: 'Featured Inventory',
  description: 'Explore selected items from Brock Guns and Repair.',
  limit: 6,
};

export const valueProps = {
  eyebrow: 'Why Brock',
  heading: 'Buy from someone who answers his own phone.',
  items: [
    {
      title: 'Personal service',
      description: 'You deal directly with David Johnson, the owner. No call center, no runaround.',
    },
    {
      title: 'Straight answers',
      description:
        'Ask about any item and get a plain, professional answer, whether or not you buy.',
    },
    {
      title: 'Texas values',
      description:
        'Traditional craftsmanship and a simple standard: do it right and treat people right.',
    },
  ],
};

export const meetOwner = {
  eyebrow: 'The owner',
  heading: 'Meet David Johnson',
  lede: "Brock Guns and Repair is David's business, and his name stands behind it. When you call, you talk to the owner.",
  story: pending(
    "DAVID'S STORY: two or three sentences in his own words. To be supplied by David.",
  ),
  linkLabel: 'More about David',
};
