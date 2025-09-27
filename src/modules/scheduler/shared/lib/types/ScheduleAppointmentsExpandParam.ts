type ExpandField = 'order' | 'entityInfo' | 'prevAppointmentCount';

export type ScheduleAppointmentsExpandParam =
  | ExpandField
  | `${ExpandField},${ExpandField}`
  | `${ExpandField},${ExpandField},${ExpandField}`;
