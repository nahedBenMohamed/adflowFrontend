import type { ProjectEntitiesReportMetaDto } from './ProjectEntitiesReportMetaDto';
import type { ProjectEntitiesReportRowDto } from './ProjectEntitiesReportRowDto';

export interface ProjectEntitiesReportDto {
  rows: ProjectEntitiesReportRowDto[];
  total: ProjectEntitiesReportRowDto;
  meta: ProjectEntitiesReportMetaDto;
}
