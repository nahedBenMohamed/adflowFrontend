import type { CustomerReportFieldMetaDto } from '../../../../../api';

export class CustomerReportFieldMeta {
  fieldId: number;
  fieldName: string;

  constructor({ fieldId, fieldName }: CustomerReportFieldMeta) {
    this.fieldId = fieldId;
    this.fieldName = fieldName;
  }

  static fromDto(dto: CustomerReportFieldMetaDto): CustomerReportFieldMeta {
    return new CustomerReportFieldMeta({
      fieldId: dto.fieldId,
      fieldName: dto.fieldName,
    });
  }

  static fromDtos(dtos: CustomerReportFieldMetaDto[]): CustomerReportFieldMeta[] {
    return dtos.map(this.fromDto);
  }
}
