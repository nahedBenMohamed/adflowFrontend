import type { Nullable } from '@/shared';

export interface SalesPipelineReportRowDto {
  stageId: number;
  stageName: string;
  stageColor: string;
  stageOrder: number;
  daysCount: Nullable<number>;
  percent: number;
  value: number;
  count: number;
}
