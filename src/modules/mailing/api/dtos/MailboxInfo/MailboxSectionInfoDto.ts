import type { MailboxFolderType } from '../../../shared';
import type { MailboxShortInfoDto } from './MailboxShortInfoDto';

export interface MailboxSectionInfoDto {
  type: MailboxFolderType;
  unread: number;
  total: number;
  mailboxes: MailboxShortInfoDto[];
}
