import type { ProjectEntitiesReportDto } from '../../../../../api';
import { ProjectEntitiesReportRow } from './ProjectEntitiesReportRow';
import { ProjectEntitiesReportMeta } from './ProjectReportMeta';

export class ProjectEntitiesReport {
  rows: ProjectEntitiesReportRow[];
  total: ProjectEntitiesReportRow;
  meta: ProjectEntitiesReportMeta;

  constructor({ rows, meta, total }: ProjectEntitiesReport) {
    this.rows = rows;
    this.meta = meta;
    this.total = total;
  }

  static fromDto(dto: ProjectEntitiesReportDto): ProjectEntitiesReport {
    return new ProjectEntitiesReport({
      rows: ProjectEntitiesReportRow.fromDtos(dto.rows),
      total: ProjectEntitiesReportRow.fromDto(dto.total),
      meta: ProjectEntitiesReportMeta.fromDto(dto.meta),
    });
  }
}
