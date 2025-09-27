import { UtcDate, type Nullable } from '@/shared';
import type { ChatMessageDto } from '../../../../api';
import { ChatMessageFile } from './ChatMessageFile';
import { ChatMessageReaction } from './ChatMessageReaction';
import { ChatMessageStatus } from './ChatMessageStatus';
import { ChatMessageUserStatus } from './ChatMessageUserStatus';

export class ChatMessage {
  id: number;
  chatId: number;
  chatUserId: number;
  text: string;
  statuses: ChatMessageUserStatus[];
  files: ChatMessageFile[];
  replyTo: Nullable<ChatMessage>;
  reactions: ChatMessageReaction[];
  createdAt: UtcDate;

  constructor({
    id,
    chatId,
    chatUserId,
    text,
    statuses,
    files,
    replyTo,
    reactions,
    createdAt,
  }: {
    id: number;
    chatId: number;
    chatUserId: number;
    text: string;
    statuses: ChatMessageUserStatus[];
    files: ChatMessageFile[];
    replyTo: Nullable<ChatMessage>;
    reactions: ChatMessageReaction[];
    createdAt: UtcDate;
  }) {
    this.id = id;
    this.chatId = chatId;
    this.chatUserId = chatUserId;
    this.text = text;
    this.statuses = statuses;
    this.files = files;
    this.replyTo = replyTo;
    this.reactions = reactions;
    this.createdAt = createdAt;
  }

  static fromDto(dto: ChatMessageDto): ChatMessage {
    return new ChatMessage({
      id: dto.id,
      chatId: dto.chatId,
      chatUserId: dto.chatUserId,
      text: dto.text,
      statuses: ChatMessageUserStatus.fromDtos(dto.statuses),
      files: ChatMessageFile.fromDtos(dto.files),
      replyTo: dto.replyTo ? ChatMessage.fromDto(dto.replyTo) : null,
      reactions: ChatMessageReaction.fromDtos(dto.reactions),
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: ChatMessageDto[]): ChatMessage[] {
    return dtos.map(this.fromDto);
  }

  wasMessageSeenByOthers = (currentChatUserId: number): boolean => {
    return this.statuses
      .filter(s => s.chatUserId !== currentChatUserId)
      .some(s => s.status === ChatMessageStatus.SEEN);
  };

  wasMessageSeenByCurrent = (currentChatUserId: number): boolean => {
    return this.statuses
      .filter(s => s.chatUserId === currentChatUserId)
      .some(s => s.status === ChatMessageStatus.SEEN);
  };
}
