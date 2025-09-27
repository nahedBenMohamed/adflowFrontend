import type { TelephonyReportRowDto } from './TelephonyReportRowDto';

export interface TelephonyReportDto {
  users: TelephonyReportRowDto[];
  departments: TelephonyReportRowDto[];
  total: TelephonyReportRowDto;
}
