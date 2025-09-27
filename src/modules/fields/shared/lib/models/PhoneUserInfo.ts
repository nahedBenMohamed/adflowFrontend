import type { Nullable } from '@/shared';
import type { PhoneUserInfoDto } from '../../../api';

export class PhoneUserInfo {
  utcOffset: Nullable<number>;
  country: Nullable<string>;
  region: Nullable<string>;
  city: Nullable<string>;

  constructor({ utcOffset, country, region, city }: PhoneUserInfo) {
    this.utcOffset = utcOffset;
    this.city = city;
    this.region = region;
    this.country = country;
  }

  static fromDto(dto: PhoneUserInfoDto): PhoneUserInfo {
    return new PhoneUserInfo({
      city: dto.city,
      region: dto.region,
      country: dto.country,
      utcOffset: dto.utcOffset,
    });
  }
}
