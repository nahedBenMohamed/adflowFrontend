import type { Currency, Nullable } from '@/shared';

export interface ProductPriceDto {
  id: number;
  unitPrice: number;
  currency: Currency;
  name: Nullable<string>;
  maxDiscount: Nullable<number>;
}
