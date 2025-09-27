import type { SalesPipelineReportRowDto } from './SalesPipelineReportRowDto';

export interface PipelineReportDto {
  totalSales: number;
  conversionToSale: number;
  averageAmount: number;
  averageTerm: number;
  rows: SalesPipelineReportRowDto[];
}
