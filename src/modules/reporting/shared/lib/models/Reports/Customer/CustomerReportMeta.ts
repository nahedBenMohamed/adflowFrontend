import type { CustomerReportMetaDto } from '../../../../../api';
import { CustomerReportFieldMeta } from './CustomerReportFieldMeta';

export class CustomerReportMeta {
  total: number;
  offset: number;
  fields: CustomerReportFieldMeta[];

  constructor({ total, offset, fields }: CustomerReportMeta) {
    this.total = total;
    this.offset = offset;
    this.fields = fields;
  }

  static fromDto(dto: CustomerReportMetaDto): CustomerReportMeta {
    return new CustomerReportMeta({
      total: dto.total,
      offset: dto.offset,
      fields: CustomerReportFieldMeta.fromDtos(dto.fields),
    });
  }
}
