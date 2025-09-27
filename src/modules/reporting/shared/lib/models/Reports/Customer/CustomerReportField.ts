import type { CustomerReportFieldDto } from '../../../../../api';

export class CustomerReportField {
  value: number;
  fieldId: number;
  fieldName: string;

  constructor({ fieldId, fieldName, value }: CustomerReportField) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
    this.value = value;
  }

  static fromDto(dto: CustomerReportFieldDto): CustomerReportField {
    return new CustomerReportField({
      value: dto.value,
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
    });
  }

  static fromDtos(dtos: CustomerReportFieldDto[]): CustomerReportField[] {
    return dtos.map(this.fromDto);
  }
}
