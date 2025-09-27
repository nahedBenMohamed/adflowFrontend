import type { EntityCreatedAtFilter, EntityInfo, Nullable } from '@/shared';
import type { DeadlineType } from '../DeadlineType';
import { BaseTaskBoardFilter } from './BaseTaskBoardFilter';
import type { TaskSorting } from './TaskSorting';

export class TimeBoardFilter extends BaseTaskBoardFilter {
  groups?: Nullable<DeadlineType[]>;

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
    groups,
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
    groups?: Nullable<DeadlineType[]>;
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

    this.groups = groups;
  }
}
