import { UtcDate, type EntityInfo, type Nullable } from '@/shared';
import type { MailMessageDto } from '../../../../api';
import { MailMessagePayload } from './MailMessagePayload';

export class MailMessage {
  id: number;
  date: UtcDate;
  isSeen: boolean;
  threadId: string;
  mailboxId: number;
  cc: Nullable<string[]>;
  hasAttachment: boolean;
  snippet: Nullable<string>;
  subject: Nullable<string>;
  sentFrom: Nullable<string>;
  sentTo: Nullable<string[]>;
  replyTo: Nullable<string[]>;
  payloads: MailMessagePayload[];
  entityInfo: Nullable<EntityInfo>;

  constructor({
    id,
    cc,
    date,
    sentTo,
    snippet,
    replyTo,
    subject,
    threadId,
    sentFrom,
    payloads,
    mailboxId,
    entityInfo,
    hasAttachment,
  }: MailMessage) {
    this.id = id;
    this.cc = cc;
    this.date = date;
    this.sentTo = sentTo;
    this.snippet = snippet;
    this.replyTo = replyTo;
    this.subject = subject;
    this.threadId = threadId;
    this.sentFrom = sentFrom;
    this.payloads = payloads;
    this.mailboxId = mailboxId;
    this.entityInfo = entityInfo;
    this.hasAttachment = hasAttachment;
  }

  static fromDto(dto: MailMessageDto): MailMessage {
    // I hope in the future backend will return proper array...
    const fromStringWithCommasToArr = (str: Nullable<string>): Nullable<string[]> => {
      return str ? str.split(',').map<string>(s => s.trim()) : null;
    };

    return new MailMessage({
      id: dto.id,
      isSeen: dto.isSeen,
      snippet: dto.snippet,
      subject: dto.subject,
      threadId: dto.threadId,
      sentFrom: dto.sentFrom,
      mailboxId: dto.mailboxId,
      entityInfo: dto.entityInfo,
      date: UtcDate.parseISO(dto.date),
      hasAttachment: dto.hasAttachment,
      cc: fromStringWithCommasToArr(dto.cc),
      sentTo: fromStringWithCommasToArr(dto.sentTo),
      replyTo: fromStringWithCommasToArr(dto.replyTo),
      payloads: MailMessagePayload.fromDtos(dto.payloads),
    });
  }

  static fromDtos(dtos: MailMessageDto[]): MailMessage[] {
    return dtos.map(this.fromDto);
  }
}
