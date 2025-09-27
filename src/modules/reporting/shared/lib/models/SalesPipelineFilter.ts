import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { PipelineReportType } from './Pipeline/PipelineReportType';

export class SalesPipelineFilter {
  type: PipelineReportType;
  boardId: number;
  userIds?: Nullable<number[]>;
  period?: EntityCreatedAtFilter;

  constructor({ type, boardId, userIds, period }: SalesPipelineFilter) {
    this.type = type;
    this.userIds = userIds;
    this.boardId = boardId;
    this.period = period;
  }
}
