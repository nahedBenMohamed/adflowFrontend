import type { UserCalendarIntervalDto } from './UserCalendarIntervalDto';

export interface UserCalendarDto {
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  appointmentLimit?: number;
  intervals?: UserCalendarIntervalDto[];
}
