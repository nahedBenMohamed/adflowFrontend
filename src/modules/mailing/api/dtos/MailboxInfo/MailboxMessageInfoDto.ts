import type { Nullable } from '@/shared';

export interface MailMessageInfoDto {
  id: number;
  mailboxId: number;
  threadId: string;
  snippet: Nullable<string>;
  sentFrom: string;
  sentTo: Nullable<string>;
  subject: Nullable<string>;
  date: string;
  hasAttachment: boolean;
  isSeen: boolean;
  folders: string[];
}
