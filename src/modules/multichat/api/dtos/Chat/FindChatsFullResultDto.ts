import type { PagingMeta } from '@/shared';
import type { ChatDto } from './ChatDto';

export interface FindChatsFullResultDto {
  chats: ChatDto[];
  meta: PagingMeta;
}
