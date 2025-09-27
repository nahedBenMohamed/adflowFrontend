import type { MailboxFolderType } from '../../../shared';

export interface MailboxFolderInfoDto {
  id: number;
  name: string;
  unread: number;
  type: MailboxFolderType;
  total: number;
}
