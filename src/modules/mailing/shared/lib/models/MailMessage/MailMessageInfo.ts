import { UtcDate, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { MailMessageInfoDto } from '../../../../api';

export class MailMessageInfo {
  id: number;
  mailboxId: number;
  threadId: string;
  snippet: Nullable<string>;
  sentFrom: string;
  sentTo: Nullable<string>;
  subject: Nullable<string>;
  date: UtcDate;
  hasAttachment: boolean;
  isSeen: boolean;
  folders: string[];

  constructor({
    id,
    mailboxId,
    threadId,
    snippet,
    sentFrom,
    sentTo,
    subject,
    date,
    hasAttachment,
    isSeen,
    folders,
  }: MailMessageInfo) {
    this.id = id;
    this.mailboxId = mailboxId;
    this.threadId = threadId;
    this.snippet = snippet;
    this.sentFrom = sentFrom;
    this.sentTo = sentTo;
    this.subject = subject;
    this.date = date;
    this.hasAttachment = hasAttachment;
    this.isSeen = isSeen;
    this.folders = folders;

    makeAutoObservable(this);
  }

  static fromDto(dto: MailMessageInfoDto): MailMessageInfo {
    return new MailMessageInfo({
      id: dto.id,
      mailboxId: dto.mailboxId,
      threadId: dto.threadId,
      snippet: dto.snippet,
      sentFrom: dto.sentFrom,
      sentTo: dto.sentTo,
      subject: dto.subject,
      date: UtcDate.parseISO(dto.date),
      hasAttachment: dto.hasAttachment,
      isSeen: dto.isSeen,
      folders: dto.folders,
    });
  }

  static fromDtos(dtos: MailMessageInfoDto[]): MailMessageInfo[] {
    return dtos.map(this.fromDto);
  }
}
