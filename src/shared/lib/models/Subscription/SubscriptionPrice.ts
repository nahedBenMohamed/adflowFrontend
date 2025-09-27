import type { SubscriptionPriceDto } from '@/app';
import type { BillingInterval } from './BillingInterval';

export class SubscriptionPrice {
  id: string;
  amount: number;
  currency: string;
  interval: BillingInterval;

  constructor({ id, amount, currency, interval }: SubscriptionPriceDto) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.interval = interval;
  }

  static fromDto(dto: SubscriptionPriceDto): SubscriptionPrice {
    return new SubscriptionPrice({
      id: dto.id,
      amount: dto.amount,
      currency: dto.currency,
      interval: dto.interval,
    });
  }

  static fromDtos(dtos: SubscriptionPriceDto[]): SubscriptionPrice[] {
    return dtos.map(this.fromDto);
  }
}
