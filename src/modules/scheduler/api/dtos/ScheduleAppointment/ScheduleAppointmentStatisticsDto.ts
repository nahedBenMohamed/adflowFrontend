export interface ScheduleAppointmentStatisticsDto {
  newbies: number;
  notScheduled: number;
  notTookPlace: number;
  statuses: {
    canceled: number;
    completed: number;
    confirmed: number;
    not_confirmed: number;
  };
  total: number;
}
