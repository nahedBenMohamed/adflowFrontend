import type { Nullable } from '@/shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';

export class ProjectTaskUserReportFilterDto {
  boardId: number;
  entityId?: Nullable<number>;
  taskUserIds?: Nullable<number[]>;
  period?: Nullable<DatePeriodFilter>;
  taskBoardStageIds?: Nullable<number[]>;

  constructor({
    period,
    boardId,
    entityId,
    taskUserIds,
    taskBoardStageIds,
  }: ProjectTaskUserReportFilterDto) {
    this.period = period;
    this.boardId = boardId;
    this.entityId = entityId;
    this.taskUserIds = taskUserIds;
    this.taskBoardStageIds = taskBoardStageIds;
  }
}
