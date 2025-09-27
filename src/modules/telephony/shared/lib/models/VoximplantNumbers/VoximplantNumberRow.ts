import type { Nullable } from '@/shared';

export class VoximplantNumberRow {
  id: Nullable<number>;
  externalId: string;
  phoneNumber: string;
  isConnected: boolean;
  isExistsInVoximplant: boolean;
  countryCode?: string;
  regionName?: string;
  userIds?: number[];

  constructor({
    id,
    externalId,
    phoneNumber,
    isConnected,
    isExistsInVoximplant,
    countryCode,
    regionName,
    userIds,
  }: VoximplantNumberRow) {
    this.id = id;
    this.externalId = externalId;
    this.phoneNumber = phoneNumber;
    this.isConnected = isConnected;
    this.isExistsInVoximplant = isExistsInVoximplant;
    this.countryCode = countryCode;
    this.regionName = regionName;
    this.userIds = userIds;
  }
}
