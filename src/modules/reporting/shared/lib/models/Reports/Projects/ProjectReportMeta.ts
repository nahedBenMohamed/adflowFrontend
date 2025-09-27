import type { ProjectEntitiesReportMetaDto } from '../../../../../api';
import { ProjectReportFieldMeta } from './ProjectReportFieldMeta';

export class ProjectEntitiesReportMeta {
  fields: ProjectReportFieldMeta[];

  constructor({ fields }: ProjectEntitiesReportMeta) {
    this.fields = fields;
  }

  static fromDto(dto: ProjectEntitiesReportMetaDto): ProjectEntitiesReportMeta {
    return new ProjectEntitiesReportMeta({ fields: ProjectReportFieldMeta.fromDtos(dto.fields) });
  }
}
