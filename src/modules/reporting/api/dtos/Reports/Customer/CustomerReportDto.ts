import type { CustomerReportMetaDto } from './CustomerReportMetaDto';
import type { CustomerReportRowDto } from './CustomerReportRowDto';

export interface CustomerReportDto {
  meta: CustomerReportMetaDto;
  rows: CustomerReportRowDto[];
  total: CustomerReportRowDto;
}
