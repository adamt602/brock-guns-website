/**
 * Icon set: 24x24 stroke icons from the approved design.
 * Each entry is the inner SVG markup for one icon.
 */
export const icons = {
  phone:
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
  'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  image:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-8 8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  compass: '<circle cx="12" cy="5" r="2"/><path d="M11 7L6 20M13 7l5 13M8.6 14h6.8"/>',
  wrench:
    '<path d="M14.5 5.5a4.5 4.5 0 0 0-3.9 6.4L4 18.5V20h1.5l6.6-6.6a4.5 4.5 0 0 0 6.4-3.9l-2.8 2.8-2.4-.6-.6-2.4 2.8-2.8a4.5 4.5 0 0 0-1-1z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.4v.2"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.2"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  filter:
    '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
} as const;

export type IconName = keyof typeof icons;
