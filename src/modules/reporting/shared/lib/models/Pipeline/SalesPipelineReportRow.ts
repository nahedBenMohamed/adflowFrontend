import type { Nullable } from '@/shared';
import type { SalesPipelineReportRowDto } from '../../../../api';

export class SalesPipelineReportRow {
  stageId: number;
  stageName: string;
  stageColor: string;
  stageOrder: number;
  daysCount: Nullable<number>;
  percent: number;
  value: number;
  count: number;

  constructor({
    stageId,
    stageName,
    stageColor,
    stageOrder,
    daysCount,
    percent,
    value,
    count,
  }: SalesPipelineReportRow) {
    this.stageId = stageId;
    this.stageName = stageName;
    this.stageColor = stageColor;
    this.stageOrder = stageOrder;
    this.daysCount = daysCount;
    this.percent = percent;
    this.value = value;
    this.count = count;
  }

  static fromDto(dto: SalesPipelineReportRowDto): SalesPipelineReportRow {
    return new SalesPipelineReportRow({
      stageId: dto.stageId,
      stageName: dto.stageName,
      stageColor: dto.stageColor,
      stageOrder: dto.stageOrder,
      daysCount: dto.daysCount,
      percent: dto.percent,
      value: dto.value,
      count: dto.count,
    });
  }

  static fromDtos(dtos: SalesPipelineReportRowDto[]): SalesPipelineReportRow[] {
    return dtos.map(this.fromDto);
  }
}
