import type { PhoneNumberDto } from '../../../../api';

export class PhoneNumber {
  externalId: string;
  phoneNumber: string;
  countryCode: string;
  regionName?: string;

  constructor({ externalId, phoneNumber, countryCode, regionName }: PhoneNumber) {
    this.externalId = externalId;
    this.phoneNumber = phoneNumber;
    this.countryCode = countryCode;
    this.regionName = regionName;
  }

  static fromDto(dto: PhoneNumberDto): PhoneNumber {
    return new PhoneNumber({
      externalId: dto.externalId,
      phoneNumber: dto.phoneNumber,
      countryCode: dto.countryCode,
      regionName: dto.regionName,
    });
  }

  static fromDtos(dtos: PhoneNumberDto[]): PhoneNumber[] {
    return dtos.map(this.fromDto);
  }
}
