import { CalendarView, type Nullable, type UtcDateValue } from '@/shared';

export const calculateStartDate = (
  startDate: UtcDateValue,
  view?: Nullable<CalendarView>
): UtcDateValue => {
  if (!startDate || !view) return null;

  switch (view) {
    case CalendarView.DAY:
      return startDate.startOfDay();

    case CalendarView.AGENDA:
    case CalendarView.WEEK:
    case CalendarView.MONTH:
      return startDate.startOfMonth();
  }
};
