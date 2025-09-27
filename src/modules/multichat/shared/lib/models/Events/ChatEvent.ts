export class ChatEvent {
  accountId: number;
  userId: number;
  providerId: number;
  chatId: number;

  constructor(accountId: number, userId: number, providerId: number, chatId: number) {
    this.accountId = accountId;
    this.userId = userId;
    this.providerId = providerId;
    this.chatId = chatId;
  }
}
