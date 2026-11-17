/**
 * Contact form behavior: prefill from the URL, validate, then submit.
 *
 * Submission is real or it is not shown as real:
 *  - With `data-endpoint` set, the message is sent through `lib/api/inquiries`
 *    and the success notice appears only when the server accepts it.
 *  - Without an endpoint, a "not connected" notice explains that nothing was
 *    sent and points to the phone number.
 */

import { submitInquiry, type Inquiry } from '@/lib/api/inquiries';

type Status = 'invalid' | 'not-connected' | 'sent' | 'failed';
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValid(field: FieldElement): boolean {
  const value = field.value.trim();
  if (field.required && value === '') return false;
  if (field.type === 'email') return EMAIL_PATTERN.test(value);
  return true;
}

function readInquiry(form: HTMLFormElement): Inquiry {
  const data = new FormData(form);
  const text = (name: keyof Inquiry) => String(data.get(name) ?? '').trim();
  return {
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    topic: text('topic'),
    message: text('message'),
  };
}

function showFieldState(field: FieldElement, valid: boolean): void {
  const error = document.getElementById(`${field.id}-error`);
  if (!error) return;
  field.setAttribute('aria-invalid', String(!valid));
  error.hidden = valid;
}

/** Applies ?topic= and ?item= so links like "Ask About This Item" arrive ready. */
function prefillFromUrl(form: HTMLFormElement): void {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');
  const item = params.get('item');
  const topicField = form.elements.namedItem('topic');
  const messageField = form.elements.namedItem('message');

  if (topic && topicField instanceof HTMLSelectElement) {
    const exists = Array.from(topicField.options).some((option) => option.value === topic);
    if (exists) topicField.value = topic;
  }
  if (item && messageField instanceof HTMLTextAreaElement && messageField.value === '') {
    messageField.value = `I'm asking about: ${item}\n\n`;
  }
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const statusArea = document.querySelector<HTMLElement>('[data-form-status]');
  if (!form || !statusArea) return;

  const fields = Array.from(form.querySelectorAll<FieldElement>('input, select, textarea'));
  const submitButton = form.querySelector<HTMLButtonElement>('[data-submit]');
  const idleLabel = submitButton?.textContent ?? '';
  const endpoint = form.dataset.endpoint;

  function showStatus(status: Status | null): void {
    statusArea!.querySelectorAll<HTMLElement>('[data-status]').forEach((notice) => {
      notice.hidden = notice.dataset.status !== status;
    });
  }

  function setBusy(busy: boolean): void {
    if (!submitButton) return;
    submitButton.disabled = busy;
    submitButton.textContent = busy ? 'Sending…' : idleLabel;
  }

  prefillFromUrl(form);

  // Once a field has been flagged, clear the flag as soon as it is fixed.
  fields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && isValid(field)) {
        showFieldState(field, true);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => {
      const valid = isValid(field);
      showFieldState(field, valid);
      return !valid;
    });

    if (invalidFields.length > 0) {
      showStatus('invalid');
      invalidFields[0]?.focus();
      return;
    }

    if (!endpoint) {
      showStatus('not-connected');
      return;
    }

    setBusy(true);
    showStatus(null);
    try {
      await submitInquiry(endpoint, readInquiry(form));
      form.reset();
      showStatus('sent');
    } catch {
      showStatus('failed');
    } finally {
      setBusy(false);
    }
  });
}
