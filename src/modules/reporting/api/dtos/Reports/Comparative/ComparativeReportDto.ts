import type { ComparativeReportRowDto } from './ComparativeReportRowDto';

export interface ComparativeReportDto {
  users: ComparativeReportRowDto[];
  departments: ComparativeReportRowDto[];
  total: ComparativeReportRowDto;
}
