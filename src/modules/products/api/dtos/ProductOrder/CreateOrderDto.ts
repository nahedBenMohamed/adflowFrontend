import type { Currency, Nullable } from '@/shared';
import type { OrderItemDto } from './OrderItemDto';

export class CreateOrderDto {
  entityId: number;
  currency: Currency;
  taxIncluded: boolean;
  statusId: Nullable<number>;
  items: OrderItemDto[];
  warehouseId: Nullable<number>;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    entityId,
    currency,
    taxIncluded,
    statusId,
    items,
    warehouseId,
    cancelAfter,
  }: CreateOrderDto) {
    this.entityId = entityId;
    this.currency = currency;
    this.taxIncluded = taxIncluded;
    this.statusId = statusId;
    this.items = items;
    this.warehouseId = warehouseId;
    this.cancelAfter = cancelAfter;
  }
}
