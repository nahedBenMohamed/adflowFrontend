import type { CalendarEvent, Rental } from '../models';

export const transformCalendarEvents = (events: Rental[]): CalendarEvent[] =>
  events.map<CalendarEvent>(e => ({
    id: String(e.id),
    end: e.endDate,
    status: e.status,
    start: e.startDate,
    title: e.entityInfo.name,
    resourceId: String(e.productId),
  }));
