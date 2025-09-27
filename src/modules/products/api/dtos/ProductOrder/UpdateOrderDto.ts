import type { Currency, Nullable } from '@/shared';
import type { OrderItemDto } from './OrderItemDto';

export class UpdateOrderDto {
  currency: Currency;
  taxIncluded: boolean;
  statusId: Nullable<number>;
  items: OrderItemDto[];
  warehouseId: Nullable<number>;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    currency,
    taxIncluded,
    statusId,
    items,
    warehouseId,
    cancelAfter,
  }: UpdateOrderDto) {
    this.currency = currency;
    this.taxIncluded = taxIncluded;
    this.statusId = statusId;
    this.items = items;
    this.warehouseId = warehouseId;
    this.cancelAfter = cancelAfter;
  }
}
