import type { Nullable } from '@/shared';
import type { ChatUserExternalDto } from '../../../../api';

export class ChatUserExternal {
  externalId: string;
  firstName?: string;
  lastName?: Nullable<string>;
  avatarUrl?: Nullable<string>;
  phone?: Nullable<string>;
  email?: Nullable<string>;
  link?: Nullable<string>;

  constructor({
    externalId,
    firstName,
    lastName,
    avatarUrl,
    phone,
    email,
    link,
  }: {
    externalId: string;
    firstName?: string;
    lastName?: Nullable<string>;
    avatarUrl?: Nullable<string>;
    phone?: Nullable<string>;
    email?: Nullable<string>;
    link?: Nullable<string>;
  }) {
    this.externalId = externalId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.email = email;
    this.link = link;
  }

  static fromDto(dto: ChatUserExternalDto): ChatUserExternal {
    return new ChatUserExternal({
      externalId: dto.externalId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatarUrl: dto.avatarUrl,
      phone: dto.phone,
      email: dto.email,
      link: dto.link,
    });
  }

  fullName = (): string => {
    return `${this.firstName}${this.lastName ? ` ${this.lastName}` : ''}`;
  };
}
