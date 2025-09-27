import type { DatePeriodDto } from './DatePeriodDto';

export interface SalesPlanDto {
  userId: number;
  period: DatePeriodDto;
  quantity: number;
  amount: number;
}
