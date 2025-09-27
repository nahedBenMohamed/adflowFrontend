import type { CalendarInfoDto } from './CalendarInfoDto';

export interface CalendarAccessDto {
  token: string;
  calendarInfos: CalendarInfoDto[];
}
