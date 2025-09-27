import { type WeekDays } from './WeekDays';

// compatible with fullcalendar business days specification
export const DayNumberMap: Record<WeekDays, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
} as const;
