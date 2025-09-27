import type { CustomerReportDto } from '../../../../../api';
import { CustomerReportMeta } from './CustomerReportMeta';
import { CustomerReportRow } from './CustomerReportRow';

export class CustomerReport {
  meta: CustomerReportMeta;
  rows: CustomerReportRow[];
  total: CustomerReportRow;

  constructor({ meta, rows, total }: CustomerReport) {
    this.meta = meta;
    this.rows = rows;
    this.total = total;
  }

  static fromDto(dto: CustomerReportDto): CustomerReport {
    return new CustomerReport({
      meta: CustomerReportMeta.fromDto(dto.meta),
      rows: CustomerReportRow.fromDtos(dto.rows),
      total: CustomerReportRow.fromDto(dto.total),
    });
  }
}
