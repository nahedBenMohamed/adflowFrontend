import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { TaskBoardFilter, TaskSorting } from '../../../shared';
import { BaseTaskBoardFilterDto } from './BaseTaskBoardFilterDto';

export class TaskBoardFilterDto extends BaseTaskBoardFilterDto {
  stageIds?: Nullable<number[]>;

  constructor({
    sorting,
    search,
    showResolved,
    ownerIds,
    createdBy,
    entityIds,
    createdAt,
    startDate,
    endDate,
    resolvedDate,
    stageIds,
  }: {
    sorting?: Nullable<TaskSorting>;
    search?: Nullable<string>;
    showResolved?: Nullable<boolean>;
    ownerIds?: Nullable<number[]>;
    createdBy?: Nullable<number[]>;
    entityIds?: Nullable<number[]>;
    createdAt?: EntityCreatedAtFilter;
    startDate?: EntityCreatedAtFilter;
    endDate?: EntityCreatedAtFilter;
    resolvedDate?: EntityCreatedAtFilter;
    stageIds?: Nullable<number[]>;
  }) {
    super({
      sorting,
      search,
      showResolved,
      ownerIds,
      createdBy,
      entityIds,
      createdAt,
      startDate,
      endDate,
      resolvedDate,
    });

    this.stageIds = stageIds;
  }

  static fromModel(model: TaskBoardFilter): TaskBoardFilterDto {
    return new TaskBoardFilterDto({
      sorting: model.sorting,
      search: model.search,
      showResolved: model.showResolved,
      ownerIds: model.ownerIds,
      createdBy: model.createdBy,
      entityIds:
        model.entityInfos && model.entityInfos.length
          ? model.entityInfos.map(ei => ei.id)
          : undefined,
      createdAt: model.createdAt,
      startDate: model.startDate,
      endDate: model.endDate,
      resolvedDate: model.resolvedDate,
      stageIds: model.stageIds,
    });
  }
}
