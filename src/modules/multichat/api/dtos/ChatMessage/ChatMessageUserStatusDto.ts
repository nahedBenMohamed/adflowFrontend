import type { ChatMessageStatus } from '../../../shared';

export interface ChatMessageUserStatusDto {
  chatUserId: number;
  status: ChatMessageStatus;
  createdAt: string;
}
