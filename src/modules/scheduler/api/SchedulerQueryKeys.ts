import type {
  GetScheduleAppointmentCountQueryParams,
  GetScheduleAppointmentsQueryParams,
  GetSchedulesQueryParams,
} from '../shared';

const queryKeys = {
  scheduler: ['scheduler'],
  schedules(queryParams?: GetSchedulesQueryParams) {
    return [...this.scheduler, 'schedules', queryParams];
  },
  schedule(scheduleId: number) {
    return [...this.scheduler, 'schedules', 'schedule', scheduleId];
  },
  scheduleAppointmentsWithoutParams() {
    return [...this.scheduler, 'appointments'];
  },
  scheduleAppointments(queryParams: GetScheduleAppointmentsQueryParams) {
    return [...this.scheduleAppointmentsWithoutParams(), queryParams];
  },
  fullScheduleAppointments(queryParams: GetScheduleAppointmentsQueryParams) {
    return [...this.scheduleAppointmentsWithoutParams(), 'full', queryParams];
  },
  scheduleAppointmentCount(queryParams: GetScheduleAppointmentCountQueryParams) {
    return [...this.scheduler, 'appointments-count', queryParams];
  },
  scheduleLastAppointment(queryParams: GetScheduleAppointmentCountQueryParams) {
    return [...this.scheduler, 'appointments-last', queryParams];
  },
  scheduleAppointmentStatistics(queryParams: GetScheduleAppointmentsQueryParams) {
    return [...this.scheduler, 'appointments-statistics', queryParams];
  },
  scheduleAppointment(appointmentId: number) {
    return [...this.scheduler, 'appointment', appointmentId];
  },
} as const;

export const SCHEDULER_QUERY_KEYS = Object.freeze(queryKeys);
