import type { Nullable } from '@/shared';
import type { QuantityAmount } from '../../QuantityAmount';

export interface ScheduleReportRowDto {
  ownerId: Nullable<number>;
  ownerName: Nullable<string>;
  sold: QuantityAmount;
  all: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  canceled: number;
}
