import type { PagingMeta } from '@/shared';
import type { ChatMessageDto } from './ChatMessageDto';

export interface ChatMessagesResultDto {
  messages: ChatMessageDto[];
  meta: PagingMeta;
}
