/**
 * Enhances the <details>-based mobile menu: closes it on Escape (returning
 * focus to the toggle) and when the visitor clicks outside it.
 */
export function initMobileMenu(): void {
  const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
  if (!menu) return;

  const toggle = menu.querySelector<HTMLElement>('summary');

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target)) {
      menu.open = false;
    }
  });
}
