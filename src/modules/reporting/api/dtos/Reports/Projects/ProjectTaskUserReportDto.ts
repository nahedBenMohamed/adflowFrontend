import type { ProjectTaskUserReportTotalRow } from '../../../../shared';
import type { ProjectTaskUserReportRowDto } from './ProjectTaskUserReportRowDto';

export interface ProjectTaskUserReportDto {
  rows: ProjectTaskUserReportRowDto[];
  total: ProjectTaskUserReportTotalRow;
}
