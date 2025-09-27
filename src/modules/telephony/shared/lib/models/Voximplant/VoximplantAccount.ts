import type { VoximplantAccountDto } from '../../../../api';

export class VoximplantAccount {
  accountId: number;
  billingAccountId: number;
  isActive: boolean;
  accountName: string;
  applicationId: number;
  applicationName: string;
  apiKey: string;

  constructor(
    accountId: number,
    billingAccountId: number,
    isActive: boolean,
    accountName: string,
    applicationId: number,
    applicationName: string,
    apiKey: string
  ) {
    this.accountId = accountId;
    this.billingAccountId = billingAccountId;
    this.isActive = isActive;
    this.accountName = accountName;
    this.applicationId = applicationId;
    this.applicationName = applicationName;
    this.apiKey = apiKey;
  }

  static fromDto(dto: VoximplantAccountDto): VoximplantAccount {
    return new VoximplantAccount(
      dto.accountId,
      dto.billingAccountId,
      dto.isActive,
      dto.accountName,
      dto.applicationId,
      dto.applicationName,
      dto.apiKey
    );
  }
}
