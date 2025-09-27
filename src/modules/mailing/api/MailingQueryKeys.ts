const queryKeys = {
  mailing: ['mailing'],
  mailboxesSignatures() {
    return [...this.mailing, 'mailboxes-signatures'];
  },
} as const;

export const MAILING_QUERY_KEYS = Object.freeze(queryKeys);
