import type { EntityCreatedAtFilter, EntityInfo, Nullable } from '@/shared';
import { BaseTaskBoardFilter } from './BaseTaskBoardFilter';
import type { TaskSorting } from './TaskSorting';

export class TaskBoardFilter extends BaseTaskBoardFilter {
  stageIds?: Nullable<number[]>;

  constructor({
    sorting,
    search,
    showResolved,
    ownerIds,
    createdBy,
    entityInfos,
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
    entityInfos?: Nullable<EntityInfo[]>;
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
      entityInfos,
      createdAt,
      startDate,
      endDate,
      resolvedDate,
    });

    this.stageIds = stageIds;
  }
}
