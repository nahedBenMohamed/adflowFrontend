import type { EntityInfo, Nullable } from '@/shared';
import type { ChatType } from '../../../shared';
import type { ChatMessageDto } from '../ChatMessage/ChatMessageDto';
import type { ChatUserDto } from '../ChatUser/ChatUserDto';

export class ChatDto {
  id: number;
  providerId: number;
  createdBy: number;
  type: ChatType;
  title: Nullable<string>;
  entityId: Nullable<number>;
  createdAt: string;
  users: ChatUserDto[];
  pinnedMessages: ChatMessageDto[];
  lastMessage: Nullable<ChatMessageDto>;
  unseenCount: number;
  updatedAt: string;
  entityInfo: Nullable<EntityInfo>;
  hasAccess?: Nullable<boolean>;
}
