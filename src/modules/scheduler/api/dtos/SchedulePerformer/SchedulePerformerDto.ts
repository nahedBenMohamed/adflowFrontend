import type { Nullable } from '@/shared';
import type { SchedulePerformerType } from '../../../shared';

export interface SchedulePerformerDto {
  id: number;
  type: SchedulePerformerType;
  userId: Nullable<number>;
  departmentId: Nullable<number>;
}
