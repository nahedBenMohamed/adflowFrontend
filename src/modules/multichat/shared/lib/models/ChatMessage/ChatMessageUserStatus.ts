import { UtcDate } from '@/shared';
import type { ChatMessageUserStatusDto } from '../../../../api';
import type { ChatMessageStatus } from './ChatMessageStatus';

export class ChatMessageUserStatus {
  chatUserId: number;
  status: ChatMessageStatus;
  createdAt: UtcDate;

  constructor({ chatUserId, status, createdAt }: ChatMessageUserStatus) {
    this.chatUserId = chatUserId;
    this.status = status;
    this.createdAt = createdAt;
  }

  static fromDto(dto: ChatMessageUserStatusDto): ChatMessageUserStatus {
    return new ChatMessageUserStatus({
      chatUserId: dto.chatUserId,
      status: dto.status,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: ChatMessageUserStatusDto[]): ChatMessageUserStatus[] {
    return dtos.map(this.fromDto);
  }
}
