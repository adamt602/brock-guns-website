/**
 * Site-wide settings (as opposed to facts about the business, which live in
 * `src/data/business.ts`).
 */
export const site = {
  locale: 'en-US',
  language: 'en',
  /** Appended to every page title. */
  titleSuffix: 'Brock Guns and Repair',
  defaultDescription:
    'Brock Guns and Repair LLC: firearm sales in Texas, with gunsmithing and repair services. Call David Johnson at (817) 550-1755.',

  /** Browser UI color. Keep in sync with --color-navy in tokens.css. */
  themeColor: '#142334',

  /**
   * While true, facts that are still unverified render as clearly marked
   * "[TO BE CONFIRMED]" placeholders so nothing is forgotten.
   * Set to false to hide every placeholder (for example, before launch).
   */
  showPendingContent: true,

  /**
   * Where the contact form sends messages (JSON POST). `null` means there is
   * no backend yet: the form validates, then tells the visitor plainly that it
   * is not connected. It never pretends a message was sent.
   */
  contactFormEndpoint: import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT || null,
} as const;
