import type { ComparativeReportCellDto } from './ComparativeReportCellDto';

export interface ComparativeReportRowDto {
  ownerId: number;
  cells: ComparativeReportCellDto[];
}
