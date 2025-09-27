import { type BillingInterval } from '../../../../shared/lib/models/Subscription/BillingInterval';

export class SubscriptionPriceDto {
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
}
