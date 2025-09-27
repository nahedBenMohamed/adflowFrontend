export interface CalendarInfoDto {
  id: string;
  title: string;
  primary: boolean;
  readonly: boolean;
  description?: string;
  timeZone?: string;
  color?: string;
}
