import type { Nullable } from '@/shared';

export class ChatFindByMessageContentFilterDto {
  messageContent: string;
  providerId?: Nullable<number>;

  constructor({ messageContent, providerId }: ChatFindByMessageContentFilterDto) {
    this.messageContent = messageContent;
    this.providerId = providerId;
  }
}
