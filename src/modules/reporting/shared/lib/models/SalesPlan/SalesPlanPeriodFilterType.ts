import { DatePeriodFilterType } from '@/shared/lib/models/DatePeriodFilterType';

export const SalesPlanPeriodFilterType = [
  DatePeriodFilterType.CURRENT_MONTH,
  DatePeriodFilterType.CURRENT_QUARTER,
  DatePeriodFilterType.LAST_MONTH,
  DatePeriodFilterType.LAST_QUARTER,
] as const;
