import { userStore } from '@/app';
import { Avatar, type Nullable } from '@/shared';
import type { ChatUserDto } from '../../../../api';
import { ChatUserExternal } from './ChatUserExternal';
import type { ChatUserRole } from './ChatUserRole';

export class ChatUser {
  id: number;
  userId: Nullable<number>;
  role: ChatUserRole;
  externalUser: Nullable<ChatUserExternal>;

  constructor({
    id,
    userId,
    role,
    externalUser,
  }: {
    id: number;
    userId: Nullable<number>;
    role: ChatUserRole;
    externalUser: Nullable<ChatUserExternal>;
  }) {
    this.id = id;
    this.userId = userId;
    this.role = role;
    this.externalUser = externalUser;
  }

  static fromDto(dto: ChatUserDto): ChatUser {
    const externalUser = dto.externalUser ? ChatUserExternal.fromDto(dto.externalUser) : null;

    return new ChatUser({
      id: dto.id,
      userId: dto.userId,
      role: dto.role,
      externalUser,
    });
  }

  static fromDtos(dtos: ChatUserDto[]): ChatUser[] {
    return dtos.map(this.fromDto);
  }

  get fullName(): string {
    if (this.userId) return userStore.getById(this.userId).fullName;

    if (this.externalUser) return this.externalUser.fullName();

    throw new Error('Failed to get full name, not userId nor externalUser was specified');
  }

  getAvatar = (): Avatar => {
    if (this.userId) return userStore.getById(this.userId).getAvatar();

    if (this.externalUser)
      return new Avatar({
        isExternal: true,
        lastName: this.externalUser.lastName ?? null,
        avatarUrl: this.externalUser.avatarUrl ?? null,
        firstName: this.externalUser.firstName ?? this.externalUser.externalId,
      });

    return new Avatar({ avatarUrl: null, firstName: String(this.id), lastName: null });
  };
}
