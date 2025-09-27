import type { Nullable } from '@/shared';

export class UpdateChatMessageDto {
  replyToId?: number;
  fileIds?: Nullable<string[]>;
  text: string;

  constructor({ replyToId, fileIds, text }: UpdateChatMessageDto) {
    this.replyToId = replyToId;
    this.fileIds = fileIds;
    this.text = text;
  }
}
