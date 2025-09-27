import type { Nullable } from '@/shared';
import type { ChatUserRole } from '../../../shared';
import type { ChatUserExternalDto } from './ChatUserExternalDto';

export class ChatUserDto {
  id: number;
  userId: Nullable<number>;
  role: ChatUserRole;
  externalUser: Nullable<ChatUserExternalDto>;

  constructor({ id, userId, role, externalUser }: ChatUserDto) {
    this.id = id;
    this.userId = userId;
    this.role = role;
    this.externalUser = externalUser;
  }
}
