import type { ReactElement } from 'react';
import {
  DraftIcon,
  InboxesIcon,
  InboxIcon,
  MailboxFolderType,
  SentIcon,
  SpamIcon,
  TrashIcon,
} from '../..';

export const getIconByFolderType = (folderType?: MailboxFolderType): ReactElement => {
  switch (folderType) {
    case MailboxFolderType.INBOX:
      return <InboxesIcon />;

    case MailboxFolderType.SENT:
      return <SentIcon />;

    case MailboxFolderType.JUNK:
      return <SpamIcon />;

    case MailboxFolderType.TRASH:
      return <TrashIcon />;

    case MailboxFolderType.DRAFTS:
      return <DraftIcon />;

    default:
      return <InboxIcon />;
  }
};
