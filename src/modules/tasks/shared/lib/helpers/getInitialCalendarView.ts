import { CalendarView } from '@/shared';
import { TaskCalendarViewType } from '../models';

export const getInitialCalendarView = (currentGridPeriod: CalendarView) => {
  switch (currentGridPeriod) {
    case CalendarView.DAY:
      return TaskCalendarViewType.DAY;

    case CalendarView.WEEK:
      return TaskCalendarViewType.WEEK;

    case CalendarView.MONTH:
      return TaskCalendarViewType.MONTH;

    case CalendarView.AGENDA:
      return TaskCalendarViewType.AGENDA;
  }
};
