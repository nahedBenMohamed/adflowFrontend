import type { SubscriptionDto } from '@/app';
import type { Nullable, UtcDateValue } from '@/shared';
import { UtcDate } from '../UtcDate';
import type { AppSumoTiers } from './AppSumoTiers';

export class Subscription {
  isValid: boolean;
  isTrial: boolean;
  userLimit: number;
  createdAt: UtcDate;
  isExternal: boolean;
  expiredAt: UtcDateValue;
  planName: AppSumoTiers | string;
  firstVisit?: Nullable<UtcDate>;

  constructor({
    isValid,
    isTrial,
    createdAt,
    expiredAt,
    userLimit,
    planName,
    isExternal,
    firstVisit,
  }: Subscription) {
    this.isValid = isValid;
    this.isTrial = isTrial;
    this.planName = planName;
    this.createdAt = createdAt;
    this.expiredAt = expiredAt;
    this.userLimit = userLimit;
    this.isExternal = isExternal;
    this.firstVisit = firstVisit;
  }

  static fromDto(dto: SubscriptionDto): Subscription {
    return new Subscription({
      isValid: dto.isValid,
      isTrial: dto.isTrial,
      planName: dto.planName,
      userLimit: dto.userLimit,
      isExternal: dto.isExternal,
      createdAt: UtcDate.parseISO(dto.createdAt),
      expiredAt: UtcDate.parseISONullable(dto.expiredAt),
      firstVisit: UtcDate.parseISONullable(dto.firstVisit),
    });
  }
}
