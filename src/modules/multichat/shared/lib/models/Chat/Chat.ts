import { UtcDate, type EntityInfo, type Nullable } from '@/shared';
import type { ChatDto } from '../../../../api';
import { ChatMessage } from '../ChatMessage/ChatMessage';
import { ChatUser } from '../ChatUser/ChatUser';
import { ChatUserRole } from '../ChatUser/ChatUserRole';
import type { ChatType } from './ChatType';

export class Chat {
  id: number;
  providerId: number;
  createdBy: number;
  type: ChatType;
  title: Nullable<string>;
  entityId: Nullable<number>;
  createdAt: UtcDate;
  users: ChatUser[];
  pinnedMessages: ChatMessage[];
  lastMessage: Nullable<ChatMessage>;
  unseenCount: number;
  updatedAt: UtcDate;
  entityInfo: Nullable<EntityInfo>;
  hasAccess?: Nullable<boolean>;

  constructor({
    id,
    providerId,
    createdBy,
    type,
    title,
    entityId,
    createdAt,
    users,
    pinnedMessages,
    lastMessage,
    unseenCount,
    updatedAt,
    entityInfo,
    hasAccess,
  }: {
    id: number;
    providerId: number;
    createdBy: number;
    type: ChatType;
    title: Nullable<string>;
    entityId: Nullable<number>;
    createdAt: UtcDate;
    users: ChatUser[];
    pinnedMessages: ChatMessage[];
    lastMessage: Nullable<ChatMessage>;
    unseenCount: number;
    updatedAt: UtcDate;
    entityInfo: Nullable<EntityInfo>;
    hasAccess?: Nullable<boolean>;
  }) {
    this.id = id;
    this.providerId = providerId;
    this.createdBy = createdBy;
    this.type = type;
    this.title = title;
    this.entityId = entityId;
    this.createdAt = createdAt;
    this.users = users;
    this.pinnedMessages = pinnedMessages;
    this.lastMessage = lastMessage;
    this.unseenCount = unseenCount;
    this.updatedAt = updatedAt;
    this.entityInfo = entityInfo;
    this.hasAccess = hasAccess;
  }

  static fromDto(dto: ChatDto): Chat {
    return new Chat({
      id: dto.id,
      providerId: dto.providerId,
      createdBy: dto.createdBy,
      type: dto.type,
      title: dto.title,
      entityId: dto.entityId,
      createdAt: UtcDate.parseISO(dto.createdAt),
      users: ChatUser.fromDtos(dto.users),
      pinnedMessages: ChatMessage.fromDtos(dto.pinnedMessages),
      lastMessage: dto.lastMessage ? ChatMessage.fromDto(dto.lastMessage) : null,
      unseenCount: dto.unseenCount,
      updatedAt: UtcDate.parseISO(dto.updatedAt),
      entityInfo: dto.entityInfo,
      hasAccess: dto.hasAccess,
    });
  }

  static fromDtos(dtos: ChatDto[]): Chat[] {
    return dtos.map(this.fromDto);
  }

  getInternalUsers = (): ChatUser[] => {
    return this.users.filter(u => Boolean(u.userId));
  };

  getSupervisors = (): ChatUser[] => {
    return this.users.filter(u => u.role === ChatUserRole.SUPERVISOR);
  };

  getSupervisorsUsersIds = (): number[] => {
    return this.getSupervisors()
      .map<Nullable<number>>(s => s.userId)
      .filter(Boolean) as number[];
  };

  getChatUser = (chatUserId: number): ChatUser => {
    const chatUser = this.users.find(u => u.id === chatUserId);

    if (!chatUser) throw new Error(`Chat user with id ${chatUserId} was not found`);

    return chatUser;
  };

  getChatOwners = (): ChatUser[] => {
    return this.users.filter(u => u.role === ChatUserRole.OWNER);
  };

  getChatOwnersUserIds = (): number[] => {
    return this.getChatOwners()
      .map<Nullable<number>>(o => o.userId)
      .filter(Boolean) as number[];
  };

  getExternalUsers = (): ChatUser[] => {
    return this.users.filter(u => u.externalUser);
  };

  getChatUserByUserId = (userId: number): ChatUser => {
    const chatUser = this.users.find(u => u.userId === userId);

    if (!chatUser) throw new Error(`Chat user with user id ${userId} was not found`);

    return chatUser;
  };

  getIsChatOwnerOrAdminByUserId = (userId: number): boolean => {
    const chatUser = this.getChatUserByUserId(userId);

    return [ChatUserRole.OWNER, ChatUserRole.ADMIN].includes(chatUser.role);
  };
}
