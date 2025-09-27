import type { ScheduleReportRowDto } from './ScheduleReportRowDto';

export interface ScheduleReportDto {
  rows: ScheduleReportRowDto[];
  total: ScheduleReportRowDto;
}
