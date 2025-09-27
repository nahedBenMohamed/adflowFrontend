import type { ProjectReportFieldDto } from '../../../../../api';

export class ProjectReportField {
  fieldId: number;
  fieldName: string;
  value: number;

  constructor({ fieldId, fieldName, value }: ProjectReportField) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.value = value;
  }

  static fromDto(dto: ProjectReportFieldDto): ProjectReportField {
    return new ProjectReportField({
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
      value: dto.value,
    });
  }

  static fromDtos(dtos: ProjectReportFieldDto[]): ProjectReportField[] {
    return dtos.map(this.fromDto);
  }
}
