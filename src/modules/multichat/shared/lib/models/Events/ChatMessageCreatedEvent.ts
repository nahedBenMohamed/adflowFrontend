import type { Nullable } from '@/shared';
import { ChatMessageEvent } from './ChatMessageEvent';

export class ChatMessageCreatedEvent extends ChatMessageEvent {
  fromUser: string;
  text: string;
  createdAt: string;
  entityId: Nullable<number>;

  constructor(
    accountId: number,
    userId: number,
    providerId: number,
    chatId: number,
    messageId: number,
    fromUser: string,
    text: string,
    createdAt: string,
    entityId: Nullable<number>
  ) {
    super(accountId, userId, providerId, chatId, messageId);

    this.fromUser = fromUser;
    this.text = text;
    this.createdAt = createdAt;
    this.entityId = entityId;
  }
}
