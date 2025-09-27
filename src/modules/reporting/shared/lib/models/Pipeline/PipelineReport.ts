import type { Nullable } from '@/shared';
import type { PipelineReportDto } from '../../../../api';
import type { SalesPipelineReportRow } from './SalesPipelineReportRow';

export class PipelineReport {
  totalSales: Nullable<number>;
  conversionToSale: Nullable<number>;
  averageAmount: Nullable<number>;
  averageTerm: Nullable<number>;
  rows: SalesPipelineReportRow[];

  constructor({ totalSales, conversionToSale, averageAmount, averageTerm, rows }: PipelineReport) {
    this.totalSales = totalSales;
    this.conversionToSale = conversionToSale;
    this.averageAmount = averageAmount;
    this.averageTerm = averageTerm;
    this.rows = rows;
  }

  static fromDto(dto: PipelineReportDto): PipelineReport {
    return new PipelineReport({
      totalSales: dto.totalSales,
      conversionToSale: dto.conversionToSale,
      averageAmount: dto.averageAmount,
      averageTerm: dto.averageTerm,
      rows: dto.rows,
    });
  }
}
