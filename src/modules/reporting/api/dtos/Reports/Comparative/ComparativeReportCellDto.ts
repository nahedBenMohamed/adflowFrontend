import type { ComparativeReportValueDto } from './ComparativeReportValueDto';

export interface ComparativeReportCellDto {
  date: string;
  all: ComparativeReportValueDto;
  open: ComparativeReportValueDto;
  lost: ComparativeReportValueDto;
  won: ComparativeReportValueDto;
}
