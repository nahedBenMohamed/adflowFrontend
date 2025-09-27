import type { TFunction } from 'i18next';
import type { MailboxShortInfo } from '../models';

export const getDemoMailboxes = (t: TFunction): MailboxShortInfo[] => [
  {
    id: 1,
    name: t('mailbox', { number: '#1' }),
    unread: 0,
    total: 0,
  },
  {
    id: 2,
    name: t('mailbox', { number: '#2' }),
    unread: 0,
    total: 0,
  },
  {
    id: 3,
    name: t('mailbox', { number: '#3' }),
    unread: 0,
    total: 0,
  },
];
