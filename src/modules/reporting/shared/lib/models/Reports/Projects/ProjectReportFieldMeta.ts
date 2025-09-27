import type { ProjectReportFieldMetaDto } from '../../../../../api';

export class ProjectReportFieldMeta {
  fieldId: number;
  fieldName: string;

  constructor({ fieldId, fieldName }: ProjectReportFieldMeta) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
  }

  static fromDto(dto: ProjectReportFieldMetaDto): ProjectReportFieldMeta {
    return new ProjectReportFieldMeta({
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
    });
  }

  static fromDtos(dtos: ProjectReportFieldMetaDto[]): ProjectReportFieldMeta[] {
    return dtos.map(this.fromDto);
  }
}
