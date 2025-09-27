import { CalendarView, type Nullable, type UtcDateValue } from '@/shared';

export const calculateEndDate = (
  startDate: UtcDateValue,
  view?: Nullable<CalendarView>
): UtcDateValue => {
  if (!startDate || !view) return null;

  switch (view) {
    case CalendarView.DAY:
      return startDate.endOfDay();

    case CalendarView.AGENDA:
    case CalendarView.WEEK:
      return startDate.addDays(7).endOfDay();

    case CalendarView.MONTH:
      return startDate.addMonths(1).endOfDay();
  }
};
