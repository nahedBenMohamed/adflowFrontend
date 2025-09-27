import type { GeneralReportFieldMetaDto } from '../../../../../api';
import { GeneralReportFieldOptionMeta } from './GeneralReportFieldOptionMeta';

export class GeneralReportFieldMeta {
  fieldId: number;
  fieldName: string;
  values: GeneralReportFieldOptionMeta[];

  constructor({ fieldId, fieldName, values }: GeneralReportFieldMeta) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.values = values;
  }

  static fromDto(dto: GeneralReportFieldMetaDto): GeneralReportFieldMeta {
    return new GeneralReportFieldMeta({
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
      values: GeneralReportFieldOptionMeta.fromDtos(dto.values),
    });
  }

  static fromDtos(dtos: GeneralReportFieldMetaDto[]): GeneralReportFieldMeta[] {
    return dtos.map(this.fromDto);
  }
}
