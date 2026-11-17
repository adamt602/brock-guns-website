import type { Verifiable } from './content';

export interface PhoneNumber {
  /** Human-readable form, e.g. "(817) 550-1755". */
  display: string;
  /** E.164 form used in `tel:` links, e.g. "+18175501755". */
  e164: string;
}

export interface BusinessInfo {
  legalName: string;
  /** The wordmark is rendered as `${primary} & ${secondary}`. */
  wordmark: { primary: string; secondary: string };
  owner: { name: string; firstName: string; title: string };
  phone: PhoneNumber;
  /** Verified region. City and street address live in `address`. */
  region: string;
  address: Verifiable<string>;
  hours: Verifiable<string>;
  email: Verifiable<string>;
  tagline: string;
  /** Short line shown in the footer. */
  scripture: string;
}
