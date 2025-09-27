import type { Nullable } from '@/shared';
import type { GeneralReportFieldDto } from '../../../../../api';
import { GeneralReportFieldValue } from './GeneralReportFieldValue';

export class GeneralReportField {
  fieldId: number;
  fieldName: string;
  values: GeneralReportFieldValue[];

  constructor({ fieldId, fieldName, values }: GeneralReportField) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.values = values;
  }

  static fromDto(dto: GeneralReportFieldDto): GeneralReportField {
    return new GeneralReportField({
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
      values: GeneralReportFieldValue.fromDtos(dto.values),
    });
  }

  static fromDtos(dtos: Nullable<GeneralReportFieldDto[]>): Nullable<GeneralReportField[]> {
    if (!dtos) return null;

    return dtos.map(this.fromDto);
  }
}
