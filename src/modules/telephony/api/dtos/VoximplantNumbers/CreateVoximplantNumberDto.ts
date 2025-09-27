import type { Nullable } from '@/shared';

export class CreateVoximplantNumberDto {
  phoneNumber: string;
  externalId: string;
  userIds?: Nullable<number[]>;

  constructor({ phoneNumber, externalId, userIds }: CreateVoximplantNumberDto) {
    this.phoneNumber = phoneNumber;
    this.externalId = externalId;
    this.userIds = userIds;
  }
}
