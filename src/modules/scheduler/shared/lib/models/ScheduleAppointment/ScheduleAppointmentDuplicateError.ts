export class ScheduleAppointmentDuplicateError extends Error {
  appointmentId: number;

  constructor(appointmentId: number) {
    super();

    this.appointmentId = appointmentId;
  }
}
