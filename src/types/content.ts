/**
 * Content that has not been verified with the business yet.
 *
 * Unverified facts are never invented. They are stored as `PendingContent`
 * so the UI can show a clearly marked placeholder during development
 * (see `site.showPendingContent`) and nothing at all once that flag is off.
 */
export interface PendingContent {
  readonly pending: true;
  /** What still needs to be supplied or confirmed. */
  readonly note: string;
}

/** A value that is either verified (`T`) or still pending. */
export type Verifiable<T> = T | PendingContent;

export function pending(note: string): PendingContent {
  return { pending: true, note };
}

export function isPending(value: unknown): value is PendingContent {
  return typeof value === 'object' && value !== null && 'pending' in value;
}
