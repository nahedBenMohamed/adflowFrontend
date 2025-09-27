import type { ScheduleAppointmentsExpandParam } from '../../types';
import type { ScheduleAppointmentStatus } from '../ScheduleAppointment/ScheduleAppointmentStatus';

export interface GetScheduleAppointmentsQueryParams {
  title?: string;
  scheduleId?: number;
  startDate?: string;
  endDate?: string;
  entityId?: number;
  offset?: number;
  showCanceled?: boolean;
  performerId?: number;
  expand?: ScheduleAppointmentsExpandParam;
  status?: ScheduleAppointmentStatus;
  isNewbie?: boolean;
  isNotScheduled?: boolean;
  isNotTookPlace?: boolean;
}

export type GetScheduleAppointmentsStatisticsQueryParams = Pick<
  GetScheduleAppointmentsQueryParams,
  'status' | 'isNewbie' | 'isNotScheduled' | 'isNotTookPlace'
>;
