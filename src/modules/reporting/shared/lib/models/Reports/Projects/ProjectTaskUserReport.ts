import type { ProjectTaskUserReportDto } from '../../../../../api';
import { ProjectTaskUserReportRow } from './ProjectTaskUserReportRow';
import { ProjectTaskUserReportTotalRow } from './ProjectTaskUserReportTotalRow';

export class ProjectTaskUserReport {
  rows: ProjectTaskUserReportRow[];
  total: ProjectTaskUserReportTotalRow;

  constructor({ rows, total }: ProjectTaskUserReport) {
    this.rows = rows;
    this.total = total;
  }

  static fromDto(dto: ProjectTaskUserReportDto): ProjectTaskUserReport {
    return new ProjectTaskUserReport({
      rows: ProjectTaskUserReportRow.fromDtos(dto.rows),
      total: ProjectTaskUserReportTotalRow.fromDto(dto.total),
    });
  }
}
