import type { Currency, Nullable } from '@/shared';

export class UpdateProductPriceDto {
  name: Nullable<string>;
  unitPrice: number;
  currency: Currency;
  maxDiscount: Nullable<number>;

  constructor({ name, unitPrice, currency, maxDiscount }: UpdateProductPriceDto) {
    this.name = name;
    this.unitPrice = unitPrice;
    this.currency = currency;
    this.maxDiscount = maxDiscount;
  }
}
