import type { Currency, Nullable } from '@/shared';

export class CreateProductPriceDto {
  name: Nullable<string>;
  unitPrice: number;
  currency: Currency;
  maxDiscount: Nullable<number>;

  constructor({ name, unitPrice, currency, maxDiscount }: CreateProductPriceDto) {
    this.name = name;
    this.unitPrice = unitPrice;
    this.currency = currency;
    this.maxDiscount = maxDiscount;
  }
}
