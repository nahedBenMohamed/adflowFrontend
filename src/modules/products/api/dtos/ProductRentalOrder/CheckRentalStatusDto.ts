import type { DatePeriodDto } from './DatePeriodDto';

export class CheckRentalStatusDto {
  productIds: number[];
  periods: DatePeriodDto[];

  constructor({ productIds, periods }: CheckRentalStatusDto) {
    this.productIds = productIds;
    this.periods = periods;
  }
}
