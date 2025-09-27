import type { ScheduleAppointmentStatus } from './ScheduleAppointmentStatus';

export interface GetScheduleAppointmentCountQueryParams {
  entityId?: number;
  scheduleId?: number;
  showCanceled?: boolean;
  status?: ScheduleAppointmentStatus;
  startDate?: string;
  endDate?: string;
}
