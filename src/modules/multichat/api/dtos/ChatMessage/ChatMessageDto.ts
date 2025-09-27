import type { Nullable } from '@/shared';
import type { ChatMessageFileDto } from './ChatMessageFileDto';
import type { ChatMessageReactionDto } from './ChatMessageReactionDto';
import type { ChatMessageUserStatusDto } from './ChatMessageUserStatusDto';

export interface ChatMessageDto {
  id: number;
  chatId: number;
  chatUserId: number;
  text: string;
  statuses: ChatMessageUserStatusDto[];
  files: ChatMessageFileDto[];
  replyTo: Nullable<ChatMessageDto>;
  reactions: ChatMessageReactionDto[];
  createdAt: string;
}
