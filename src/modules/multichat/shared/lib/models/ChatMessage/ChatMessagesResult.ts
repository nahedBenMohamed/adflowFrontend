import type { PagingMeta } from '@/shared';
import type { ChatMessagesResultDto } from '../../../../api';
import { ChatMessage } from './ChatMessage';

export class ChatMessagesResult {
  messages: ChatMessage[];
  meta: PagingMeta;

  constructor({ messages, meta }: ChatMessagesResult) {
    this.messages = messages;
    this.meta = meta;
  }

  static fromDto(dto: ChatMessagesResultDto): ChatMessagesResult {
    return new ChatMessagesResult({
      messages: ChatMessage.fromDtos(dto.messages),
      meta: dto.meta,
    });
  }
}
