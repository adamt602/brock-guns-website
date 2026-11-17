/**
 * Network access for contact inquiries.
 *
 * This folder is where every call to the REST API belongs. UI code (components
 * and `src/scripts/`) calls functions from here and never uses `fetch()`
 * directly. See docs/backend-integration.md.
 */

export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

/**
 * Sends an inquiry as JSON. Resolves when the server accepts it and throws
 * otherwise. The server is responsible for validating and rate-limiting it;
 * the checks in the form are a convenience for the visitor, not a safeguard.
 */
export async function submitInquiry(endpoint: string, inquiry: Inquiry): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(inquiry),
  });
  if (!response.ok) throw new Error(`Inquiry was not accepted (HTTP ${response.status})`);
}
