import type { CalendarView } from '@/shared';

export type TaskCalendarRouteGenerator = ({
  view,
  year,
  month,
  day,
  from,
}: {
  view: CalendarView;
  year: number;
  month: number;
  day: number;
  from?: string;
}) => string;
