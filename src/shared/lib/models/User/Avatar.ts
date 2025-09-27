import type { Nullable } from '../../types';

export class Avatar {
  avatarUrl: Nullable<string>;
  firstName: string;
  lastName: Nullable<string>;
  isExternal?: boolean;

  constructor({ avatarUrl, firstName, lastName, isExternal = false }: Avatar) {
    this.avatarUrl = avatarUrl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isExternal = isExternal;
  }
}
