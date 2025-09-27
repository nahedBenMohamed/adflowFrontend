import type { EventInput, EventSourceInput } from '@fullcalendar/core';
import { getTaskTitle } from '../helpers';
import type { BaseTask } from '../models';

export const generateTaskCalendarEvents = ({
  tasks,
  expandEndDate,
  isTaskAllDay,
}: {
  tasks: BaseTask[];
  // if expandEndDate is true, we need to explicitly add one day to end date
  // this is needed to properly show events in month view, because in fc api, endDate is exclusive
  // see https://fullcalendar.io/docs/event-parsing
  expandEndDate: boolean;
  isTaskAllDay: (t: BaseTask) => boolean;
}): EventSourceInput =>
  tasks.map<EventInput>(t => ({
    id: String(t.id),
    start: t.startDate?.formatISOWithoutUnix(),
    end:
      expandEndDate && t.startDate && t.endDate && t.startDate.diffHours(t.endDate, true) > 25
        ? t.endDate.addDays(1).formatISOWithoutUnix()
        : t.endDate?.formatISOWithoutUnix(),
    title: getTaskTitle(t),
    extendedProps: {
      task: t,
    },
    allDay: isTaskAllDay(t),
    editable: t.userRights.canEdit,
  }));
