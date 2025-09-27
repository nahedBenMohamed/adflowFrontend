import type { EntityInfo, Nullable } from '@/shared';
import type { MailMessagePayloadDto } from './MailMessagePayloadDto';

// sentTo, cc, replyTo -> string in format "address1@company.com, address2@company.com"
export interface MailMessageDto {
  id: number;
  date: string;
  isSeen: boolean;
  threadId: string;
  mailboxId: number;
  cc: Nullable<string>;
  hasAttachment: boolean;
  sentTo: Nullable<string>;
  snippet: Nullable<string>;
  replyTo: Nullable<string>;
  subject: Nullable<string>;
  sentFrom: Nullable<string>;
  payloads: MailMessagePayloadDto[];
  entityInfo: Nullable<EntityInfo>;
}
