export class ScheduleAppointmentIntersectError extends Error {
  constructor() {
    super('Failed to create schedule appointment, because it intersects with the other.');
  }
}
