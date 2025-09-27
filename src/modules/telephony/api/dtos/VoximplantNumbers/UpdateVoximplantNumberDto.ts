import type { Nullable } from '@/shared';

export class UpdateVoximplantNumberDto {
  phoneNumber?: string;
  externalId?: string;
  userIds?: Nullable<number[]>;

  constructor({ phoneNumber, externalId, userIds }: UpdateVoximplantNumberDto) {
    this.phoneNumber = phoneNumber;
    this.externalId = externalId;
    this.userIds = userIds;
  }
}
