import type { Nullable } from '@/shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';

export class ProjectEntitiesReportFilterDto {
  entityTypeId: number;
  boardId: number;
  ownerIds?: Nullable<number[]>;
  period?: Nullable<DatePeriodFilter>;
  taskBoardStageIds?: Nullable<number[]>;

  constructor({
    entityTypeId,
    period,
    boardId,
    ownerIds,
    taskBoardStageIds,
  }: ProjectEntitiesReportFilterDto) {
    this.entityTypeId = entityTypeId;
    this.period = period;
    this.boardId = boardId;
    this.ownerIds = ownerIds;
    this.taskBoardStageIds = taskBoardStageIds;
  }
}
