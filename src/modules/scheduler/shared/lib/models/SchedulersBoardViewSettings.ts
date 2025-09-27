import type { Nullable } from '@/shared';
import type { ScheduleAppointmentStatisticsType } from './ScheduleAppointment/ScheduleAppointmentStatisticsType';

export interface SchedulersBoardViewSettings {
  schedules: {
    scheduleId: number;
    performerObjectId: Nullable<number>;
    hiddenStatsTypes?: ScheduleAppointmentStatisticsType[];
  }[];
}
