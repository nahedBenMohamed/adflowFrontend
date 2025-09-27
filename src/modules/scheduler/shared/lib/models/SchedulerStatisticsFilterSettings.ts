import type { ScheduleAppointmentStatisticsType } from './ScheduleAppointment/ScheduleAppointmentStatisticsType';

export interface SchedulerStatisticsFilterSettings {
  filters: {
    scheduleId: number;
    filter: ScheduleAppointmentStatisticsType;
  }[];
}
