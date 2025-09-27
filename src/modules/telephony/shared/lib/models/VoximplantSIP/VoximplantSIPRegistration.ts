import type { VoximplantSIPRegistrationDto } from '../../../../api';

export class VoximplantSIPRegistration {
  proxy: string;
  userId?: number;
  ruleId?: number;
  authUser?: string;
  ruleName?: string;
  purchaseDate: Date;
  sipUsername: string;
  lastUpdated: number;
  statusCode?: number;
  successful?: string;
  deactivated: boolean;
  errorMessage?: string;
  isPersistent: boolean;
  outboundProxy?: string;
  sipRegistrationId: number;
  subscriptionPrice: string;

  constructor({
    proxy,
    userId,
    ruleId,
    authUser,
    ruleName,
    purchaseDate,
    sipUsername,
    lastUpdated,
    statusCode,
    successful,
    deactivated,
    errorMessage,
    isPersistent,
    outboundProxy,
    sipRegistrationId,
    subscriptionPrice,
  }: VoximplantSIPRegistrationDto) {
    this.proxy = proxy;
    this.userId = userId;
    this.ruleId = ruleId;
    this.authUser = authUser;
    this.ruleName = ruleName;
    this.purchaseDate = purchaseDate;
    this.sipUsername = sipUsername;
    this.lastUpdated = lastUpdated;
    this.statusCode = statusCode;
    this.successful = successful;
    this.deactivated = deactivated;
    this.errorMessage = errorMessage;
    this.isPersistent = isPersistent;
    this.outboundProxy = outboundProxy;
    this.sipRegistrationId = sipRegistrationId;
    this.subscriptionPrice = subscriptionPrice;
  }

  static fromDto(dto: VoximplantSIPRegistrationDto): VoximplantSIPRegistration {
    return new VoximplantSIPRegistration({
      proxy: dto.proxy,
      userId: dto.userId,
      ruleId: dto.ruleId,
      authUser: dto.authUser,
      ruleName: dto.ruleName,
      purchaseDate: dto.purchaseDate,
      sipUsername: dto.sipUsername,
      lastUpdated: dto.lastUpdated,
      statusCode: dto.statusCode,
      successful: dto.successful,
      deactivated: dto.deactivated,
      errorMessage: dto.errorMessage,
      isPersistent: dto.isPersistent,
      outboundProxy: dto.outboundProxy,
      sipRegistrationId: dto.sipRegistrationId,
      subscriptionPrice: dto.subscriptionPrice,
    });
  }
}
