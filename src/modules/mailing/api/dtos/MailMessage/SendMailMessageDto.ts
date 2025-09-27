import type { Nullable, Optional } from '@/shared';

export class SendMailMessageDto {
  sentTo: Nullable<string[]>;
  cc: Nullable<string[]>;
  bcc: Nullable<string[]>;
  replyTo: Nullable<string>;
  subject: Nullable<string>;
  contentText: Nullable<string>;
  contentHtml: Nullable<string>;
  replyToMessageId: Nullable<number>;
  entityId: Nullable<number>;
  fileIds: Optional<Nullable<string[]>>;

  constructor({
    sentTo,
    cc,
    bcc,
    replyTo,
    subject,
    contentText,
    contentHtml,
    replyToMessageId,
    entityId,
    fileIds,
  }: SendMailMessageDto) {
    this.sentTo = sentTo;
    this.cc = cc;
    this.bcc = bcc;
    this.replyTo = replyTo;
    this.subject = subject;
    this.contentText = contentText;
    this.contentHtml = contentHtml;
    this.replyToMessageId = replyToMessageId;
    this.entityId = entityId;
    this.fileIds = fileIds;
  }
}
