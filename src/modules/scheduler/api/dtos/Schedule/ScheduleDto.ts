import type { UserCalendarIntervalDto } from '@/modules/settings';
import type { IconName, Nullable } from '@/shared';
import type { ScheduleType } from '../../../shared';
import type { SchedulePerformerDto } from '../SchedulePerformer/SchedulePerformerDto';

export interface ScheduleDto {
  id: number;
  name: string;
  icon: IconName;
  type: ScheduleType;
  entityTypeId: Nullable<number>;
  productsSectionId: Nullable<number>;
  createdAt: string;
  performers: SchedulePerformerDto[];
  timePeriod?: Nullable<number>;
  appointmentLimit?: Nullable<number>;
  oneEntityPerDay?: boolean;
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  intervals?: Nullable<UserCalendarIntervalDto[]>;
}
