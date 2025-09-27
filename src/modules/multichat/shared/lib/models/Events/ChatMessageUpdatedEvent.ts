import { ChatMessageEvent } from './ChatMessageEvent';

export class ChatMessageUpdatedEvent extends ChatMessageEvent {
  isLastMessage: boolean;

  constructor(
    accountId: number,
    userId: number,
    providerId: number,
    chatId: number,
    messageId: number,
    isLastMessage: boolean
  ) {
    super(accountId, userId, providerId, chatId, messageId);

    this.isLastMessage = isLastMessage;
  }
}
