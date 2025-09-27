import type { MailboxState } from '../../../shared';
import type { MailboxFolderInfoDto } from './MailboxFolderInfoDto';

export interface MailboxFullInfoDto {
  id: number;
  name: string;
  unread: number;
  total: number;
  state: MailboxState;
  folders: MailboxFolderInfoDto[];
  ownerId: number;
}
