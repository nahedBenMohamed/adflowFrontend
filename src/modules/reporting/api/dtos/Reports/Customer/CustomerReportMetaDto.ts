import type { CustomerReportFieldMetaDto } from './CustomerReportFieldMetaDto';

export interface CustomerReportMetaDto {
  total: number;
  offset: number;
  fields: CustomerReportFieldMetaDto[];
}
