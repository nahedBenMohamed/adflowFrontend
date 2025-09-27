import type { Nullable } from '@/shared';

export class PhoneUserInfoDto {
  utcOffset: Nullable<number>;
  country: Nullable<string>;
  region: Nullable<string>;
  city: Nullable<string>;

  constructor({ utcOffset, country, region, city }: PhoneUserInfoDto) {
    this.utcOffset = utcOffset;
    this.city = city;
    this.region = region;
    this.country = country;
  }
}
