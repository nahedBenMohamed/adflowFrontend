import { UtcDate } from '@/shared';
import type { EventRenderRange } from '@fullcalendar/core';
import type { EventDef } from '@fullcalendar/core/internal';

export const groupEventsByDate = (segs: EventRenderRange[]): Map<string, EventDef[]> => {
  const eventsByDate = new Map<string, EventDef[]>();

  segs.forEach(seg => {
    const startDate = UtcDate.fromDate(seg.range.start).format('YYYY-MM-DD');
    const existingEvents = eventsByDate.get(startDate) || [];
    eventsByDate.set(startDate, [...existingEvents, seg.def]);
  });

  return eventsByDate;
};
