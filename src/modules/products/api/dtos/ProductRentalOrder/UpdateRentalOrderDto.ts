import type { Currency, Nullable } from '@/shared';
import type { DatePeriodDto } from './DatePeriodDto';
import type { UpdateRentalOrderItemDto } from './UpdateRentalOrderItemDto';

export class UpdateRentalOrderDto {
  status: string;
  periods: DatePeriodDto[];
  items: UpdateRentalOrderItemDto[];
  currency: Currency;
  taxIncluded: boolean;
  warehouseId: Nullable<number>;

  constructor({
    status,
    periods,
    items,
    currency,
    taxIncluded,
    warehouseId,
  }: UpdateRentalOrderDto) {
    this.status = status;
    this.periods = periods;
    this.items = items;
    this.currency = currency;
    this.taxIncluded = taxIncluded;
    this.warehouseId = warehouseId;
  }
}
