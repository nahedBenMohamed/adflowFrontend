import type { Nullable } from '@/shared';
import type { SubscriptionFeatureDto } from './SubscriptionFeatureDto';
import type { SubscriptionPriceDto } from './SubscriptionPriceDto';

export class SubscriptionPlanDto {
  id: string;
  name: string;
  order: number;
  code?: string;
  isDefault: boolean;
  userLimit: Nullable<number>;
  description: Nullable<string>;
  prices: SubscriptionPriceDto[];
  features: SubscriptionFeatureDto[];
  defaultPriceId: Nullable<string> = null;
}
