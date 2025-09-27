import type { AppSumoTiers, Nullable } from '@/shared';

export interface SubscriptionDto {
  isTrial: boolean;
  isValid: boolean;
  createdAt: string;
  userLimit: number;
  isExternal: boolean;
  expiredAt: Nullable<string>;
  planName: AppSumoTiers | string;
  firstVisit?: Nullable<string>;
}
