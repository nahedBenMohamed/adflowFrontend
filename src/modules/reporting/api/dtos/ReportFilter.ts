import type { Nullable } from '@/shared';
import type { DatePeriodFilter } from './DatePeriodFilter';

export interface ReportFilter {
  userIds?: Nullable<number[]>;
  boardIds: number[];
  period: DatePeriodFilter;
}
