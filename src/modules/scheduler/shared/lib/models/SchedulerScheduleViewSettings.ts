import type { ScheduleAppointmentStatisticsType } from './ScheduleAppointment/ScheduleAppointmentStatisticsType';

export interface SchedulerScheduleViewSettings {
  schedules: {
    scheduleId: number;
    hiddenStatsTypes?: ScheduleAppointmentStatisticsType[];
  }[];
}
