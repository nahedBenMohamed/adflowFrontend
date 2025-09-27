import type { GeneralReportFieldValueDto } from './GeneralReportFieldValueDto';

export class GeneralReportFieldDto {
  fieldId: number;
  fieldName: string;
  values: GeneralReportFieldValueDto[];

  constructor({ fieldId, fieldName, values }: GeneralReportFieldDto) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.values = values;
  }
}
