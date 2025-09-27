import type { MailMessageInfoDto } from '../MailboxInfo/MailboxMessageInfoDto';

export interface MailThreadInfoDto {
  id: string;
  messages: MailMessageInfoDto[];
}
