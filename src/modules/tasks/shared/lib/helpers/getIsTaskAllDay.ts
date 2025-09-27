import { CalendarView, ConvertTimeUtil, type Nullable, UtcDate } from '@/shared';
import type { BaseTask } from '../models';

export const getIsTaskAllDay = ({
  view,
  currentDate,
  timeScaleEnabled,
  timeScaleFrom,
  timeScaleTo,
  workingTimeFrom,
  workingTimeTo,
}: {
  view: CalendarView;
  currentDate: UtcDate;
  timeScaleEnabled: boolean;
  timeScaleFrom?: string;
  timeScaleTo?: string;
  workingTimeFrom?: Nullable<string>;
  workingTimeTo?: Nullable<string>;
}): ((t: BaseTask) => boolean) => {
  return function (t) {
    if (view === CalendarView.AGENDA) {
      // Do not show all-day slot in agenda at all

      return false;
    } else if (view === CalendarView.MONTH) {
      // In month view, all events are all-day to make resize working

      return true;
    } else if (!t.startDate || !t.endDate) {
      // If we cannot determine task times, it is not shown on calendar

      return false;
    }

    const isMultiDayEvent = t.startDate.diffDays(t.endDate) >= 1;

    if (isMultiDayEvent) {
      // if task is multi-day, in week view it should be all-day
      if (view !== CalendarView.DAY) return true;

      // if we are currently on the day that is not first or last task day
      if (!currentDate.isSameDay(t.startDate) && !currentDate.isSameDay(t.endDate)) return true;
    }

    if (timeScaleEnabled && timeScaleFrom && timeScaleTo) {
      // If timescale enabled, check event times against it

      const dateTimeScaleFrom = UtcDate.createWithoutUnix({
        year: t.startDate.year,
        month: t.startDate.month,
        day: t.startDate.day,
        ...ConvertTimeUtil.parseHoursAndMinutesFromHHmm(timeScaleFrom),
      });

      const dateTimeScaleTo = UtcDate.createWithoutUnix({
        year: t.endDate.year,
        month: t.endDate.month,
        day: t.endDate.day,
        ...ConvertTimeUtil.parseHoursAndMinutesFromHHmm(timeScaleTo),
      });

      return (
        t.startDate.isBeforeOrEqual(dateTimeScaleFrom) && t.endDate.isAfterOrEqual(dateTimeScaleTo)
      );
    }

    if (!workingTimeFrom || !workingTimeTo) {
      // If we cannot determine working time, but the event is not multi-day, it is not all-day

      return false;
    }

    // Check event against account settings working time
    const dateWorkingTimeFrom = UtcDate.createWithoutUnix({
      year: t.startDate.year,
      month: t.startDate.month,
      day: t.startDate.day,
      ...ConvertTimeUtil.parseHoursAndMinutesFromHHmm(workingTimeFrom),
    });

    const dateWorkingTimeTo = UtcDate.createWithoutUnix({
      year: t.endDate.year,
      month: t.endDate.month,
      day: t.endDate.day,
      ...ConvertTimeUtil.parseHoursAndMinutesFromHHmm(workingTimeTo),
    });

    return (
      t.startDate.isBeforeOrEqual(dateWorkingTimeFrom) &&
      t.endDate.isAfterOrEqual(dateWorkingTimeTo)
    );
  };
};
