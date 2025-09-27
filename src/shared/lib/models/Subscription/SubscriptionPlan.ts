import type { SubscriptionPlanDto } from '@/app';
import type { Nullable } from '../../types';
import { SubscriptionFeature } from './SubscriptionFeature';
import { SubscriptionPrice } from './SubscriptionPrice';

export class SubscriptionPlan {
  id: string;
  name: string;
  code?: string;
  description: Nullable<string>;
  order: number;
  prices: SubscriptionPrice[];
  defaultPriceId: Nullable<string> = null;
  features: SubscriptionFeature[];
  isDefault: boolean;
  userLimit: Nullable<number>;
  perUser: Nullable<boolean>;

  constructor({
    id,
    code,
    name,
    description,
    order,
    prices,
    defaultPriceId,
    features,
    isDefault,
    userLimit,
    perUser,
  }: SubscriptionPlan) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.order = order;
    this.prices = prices;
    this.defaultPriceId = defaultPriceId;
    this.features = features;
    this.isDefault = isDefault;
    this.userLimit = userLimit;
    this.perUser = perUser;
  }

  static fromDto(dto: SubscriptionPlanDto): SubscriptionPlan {
    return new SubscriptionPlan({
      id: dto.id,
      code: dto.code,
      name: dto.name,
      order: dto.order,
      isDefault: dto.isDefault,
      userLimit: dto.userLimit,
      description: dto.description,
      defaultPriceId: dto.defaultPriceId,
      prices: SubscriptionPrice.fromDtos(dto.prices),
      features: SubscriptionFeature.fromDtos(dto.features),
      perUser: null,
    });
  }

  static fromDtos(dtos: SubscriptionPlanDto[]): SubscriptionPlan[] {
    return dtos.map(this.fromDto);
  }
}
