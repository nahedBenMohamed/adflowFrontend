import { ChatEvent } from './ChatEvent';

export abstract class ChatMessageEvent extends ChatEvent {
  messageId: number;

  constructor(
    accountId: number,
    userId: number,
    providerId: number,
    chatId: number,
    messageId: number
  ) {
    super(accountId, userId, providerId, chatId);

    this.messageId = messageId;
  }
}
