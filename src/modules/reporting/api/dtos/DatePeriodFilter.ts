import type { DatePeriodFilterType } from '@/shared';

export interface DatePeriodFilter {
  type?: DatePeriodFilterType;
  from?: string;
  to?: string;
}
