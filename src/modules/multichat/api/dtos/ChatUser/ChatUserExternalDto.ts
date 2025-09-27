import type { Nullable } from '@/shared';

export class ChatUserExternalDto {
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
  }: ChatUserExternalDto) {
    this.externalId = externalId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.email = email;
    this.link = link;
  }
}
