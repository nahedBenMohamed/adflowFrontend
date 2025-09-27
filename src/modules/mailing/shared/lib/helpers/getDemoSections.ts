import type { TFunction } from 'i18next';
import { MailboxFolderType } from '../..';
import { getDemoMailboxes } from './getDemoMailboxes';

export const getDemoSections = (t: TFunction) => {
  const demoMailboxes = getDemoMailboxes(t);

  return [
    {
      type: MailboxFolderType.INBOX,
      mailboxes: demoMailboxes,
      total: 0,
      unread: 1,
    },
    {
      type: MailboxFolderType.SENT,
      mailboxes: demoMailboxes,
      total: 0,
      unread: 0,
    },
    {
      type: MailboxFolderType.TRASH,
      mailboxes: demoMailboxes,
      total: 0,
      unread: 0,
    },
    {
      type: MailboxFolderType.JUNK,
      mailboxes: demoMailboxes,
      total: 0,
      unread: 0,
    },
    {
      type: MailboxFolderType.DRAFTS,
      mailboxes: demoMailboxes,
      total: 0,
      unread: 0,
    },
  ];
};
