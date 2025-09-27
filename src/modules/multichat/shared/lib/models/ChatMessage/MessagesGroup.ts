import type { UtcDate } from '@/shared';
import type { ChatMessage } from './ChatMessage';

export interface MessagesGroup {
  date: UtcDate;
  ms: ChatMessage[];
}
