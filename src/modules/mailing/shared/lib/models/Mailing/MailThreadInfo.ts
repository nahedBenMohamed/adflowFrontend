import { makeAutoObservable } from 'mobx';
import type { MailThreadInfoDto } from '../../../../api';
import { MailMessageInfo } from '../../models';

export class MailThreadInfo {
  id: string;
  messages: MailMessageInfo[];

  constructor({ id, messages }: { id: string; messages: MailMessageInfo[] }) {
    this.id = id;
    this.messages = messages;

    makeAutoObservable(this);
  }

  static fromDto(dto: MailThreadInfoDto): MailThreadInfo {
    return new MailThreadInfo({
      id: dto.id,
      messages: MailMessageInfo.fromDtos(dto.messages),
    });
  }

  static fromDtos(dtos: MailThreadInfoDto[]): MailThreadInfo[] {
    return dtos.map(this.fromDto);
  }

  get firstMessage(): MailMessageInfo {
    const message = this.messages[0];

    if (!message)
      throw new Error(
        `No messages available in thread ${this.id}, failed to get the first message`
      );

    return message;
  }

  get firstMessageInThread(): MailMessageInfo {
    const message = this.messages.at(-1);

    if (!message)
      throw new Error(
        `No messages available in thread ${this.id}, failed to get the first message in thread`
      );

    return message;
  }
}
