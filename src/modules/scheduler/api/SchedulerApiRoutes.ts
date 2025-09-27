export enum SchedulerApiRoutes {
  // schedules
  GET_SCHEDULE = '/api/scheduler/schedules/:scheduleId',
  GET_SCHEDULES = '/api/scheduler/schedules',
  CREATE_SCHEDULE = '/api/scheduler/schedules',
  UPDATE_SCHEDULE = '/api/scheduler/schedules/:scheduleId',
  DELETE_SCHEDULE = '/api/scheduler/schedules/:scheduleId',
  // schedule appointments
  GET_SCHEDULE_APPOINTMENTS = '/api/scheduler/appointments',
  GET_SCHEDULE_APPOINTMENT = '/api/scheduler/appointments/:appointmentId',
  CREATE_SCHEDULE_APPOINTMENT = '/api/scheduler/appointments',
  UPDATE_SCHEDULE_APPOINTMENT = '/api/scheduler/appointments/:appointmentId',
  GET_LAST_SCHEDULE_APPOINTMENT = '/api/scheduler/appointments/last',
  GET_SCHEDULE_APPOINTMENT_COUNT = '/api/scheduler/appointments/count',
  GET_SCHEDULE_APPOINTMENT_STATISTICS = '/api/scheduler/appointments/statistic',
  // schedule appointments cards list
  GET_SCHEDULE_APPOINTMENT_CARD_LIST = '/api/scheduler/appointments/cards/list',
  GET_SCHEDULE_APPOINTMENT_CARD_LIST_META = '/api/scheduler/appointments/cards/list/meta',
}
