import type { GeneralReportFieldOptionMetaDto } from './GeneralReportFieldOptionMetaDto';

export class GeneralReportFieldMetaDto {
  fieldId: number;
  fieldName: string;
  values: GeneralReportFieldOptionMetaDto[];

  constructor({ fieldId, fieldName, values }: GeneralReportFieldMetaDto) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.values = values;
  }
}
