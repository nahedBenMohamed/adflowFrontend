import type { Currency, Nullable } from '@/shared';
import type { CreateRentalOrderItemDto } from './CreateRentalOrderItemDto';
import type { DatePeriodDto } from './DatePeriodDto';

export class CreateRentalOrderDto {
  warehouseId: Nullable<number>;
  entityId: number;
  status: string;
  periods: DatePeriodDto[];
  items: CreateRentalOrderItemDto[];
  currency: Currency;
  taxIncluded: boolean;

  constructor({
    warehouseId,
    entityId,
    status,
    periods,
    items,
    currency,
    taxIncluded,
  }: CreateRentalOrderDto) {
    this.warehouseId = warehouseId;
    this.entityId = entityId;
    this.status = status;
    this.periods = periods;
    this.items = items;
    this.currency = currency;
    this.taxIncluded = taxIncluded;
  }
}
