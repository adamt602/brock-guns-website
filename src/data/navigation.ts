import { routes } from '@/config/routes';
import type { NavItem } from '@/types/navigation';

/** Header navigation (desktop bar and mobile menu). Inventory comes first. */
export const primaryNavigation: NavItem[] = [
  { label: 'Inventory', href: routes.inventory },
  { label: 'Gunsmithing & Repairs', href: routes.services },
  { label: 'About', href: routes.about },
  { label: 'FAQ', href: routes.faq },
  { label: 'Contact', href: routes.contact },
];

export const footerNavigation: NavItem[] = [
  { label: 'Inventory', href: routes.inventory },
  { label: 'Gunsmithing & Repairs', href: routes.services },
  { label: 'About David', href: routes.about },
  { label: 'FAQ', href: routes.faq },
  { label: 'Contact', href: routes.contact },
];
