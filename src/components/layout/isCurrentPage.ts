import { routes } from '@/config/routes';

/** True when `href` is the current page or one of its parent sections. */
export function isCurrentPage(href: string, pathname: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname.startsWith(href);
}
