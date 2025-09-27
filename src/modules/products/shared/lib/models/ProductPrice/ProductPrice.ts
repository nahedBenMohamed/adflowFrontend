import type { Currency, Nullable } from '@/shared';
import type { ProductPriceDto } from '../../../../api';

export class ProductPrice {
  id: number;
  name: Nullable<string>;
  unitPrice: number;
  currency: Currency;
  maxDiscount: Nullable<number>;

  constructor({ id, name, unitPrice, currency, maxDiscount }: ProductPrice) {
    this.id = id;
    this.name = name;
    this.unitPrice = unitPrice;
    this.currency = currency;
    this.maxDiscount = maxDiscount;
  }

  static fromDto(dto: ProductPriceDto): ProductPrice {
    return new ProductPrice({
      id: dto.id,
      name: dto.name,
      unitPrice: dto.unitPrice,
      currency: dto.currency,
      maxDiscount: dto.maxDiscount,
    });
  }
}
