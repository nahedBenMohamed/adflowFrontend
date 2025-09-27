import type { WeekDays } from '@/shared';

export interface UserCalendarIntervalDto {
  dayOfWeek: WeekDays;
  timeFrom: string;
  timeTo: string;
}
