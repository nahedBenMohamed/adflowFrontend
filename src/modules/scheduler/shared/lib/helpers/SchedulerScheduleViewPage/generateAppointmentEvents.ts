import type { EventSourceInput } from '@fullcalendar/core';
import type { ScheduleAppointment } from '../../models';

export const generateAppointmentEvents = (appointments: ScheduleAppointment[]): EventSourceInput =>
  appointments.map(a => ({
    id: String(a.id),
    title: `Visit #${a.id}`,
    editable: a.userRights.canEdit,
    resourceId: String(a.performerId),
    end: a.endDate.formatISOWithoutUnix(),
    start: a.startDate.formatISOWithoutUnix(),
    extendedProps: {
      appointment: a,
    },
  }));
