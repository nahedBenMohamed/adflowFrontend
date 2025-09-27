import type { Nullable } from '@/shared';

export class SendChatMessageDto {
  text: string;
  replyToId?: Nullable<number>;
  fileIds?: string[];

  constructor({ text, replyToId, fileIds }: SendChatMessageDto) {
    this.text = text;
    this.replyToId = replyToId;
    this.fileIds = fileIds;
  }
}
