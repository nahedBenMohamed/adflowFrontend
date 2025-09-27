import type { EntityCreatedAtFilter, EntityInfo, Nullable } from '@/shared';
import { BaseTaskBoardFilter } from './BaseTaskBoardFilter';
import type { TaskSorting } from './TaskSorting';

export class ActivityCardsFilter extends BaseTaskBoardFilter {
  typeIds?: Nullable<number[]>;

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
    typeIds,
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
    typeIds?: Nullable<number[]>;
  }) {
    super({
      sorting,
      search,
      showResolved,
      createdBy,
      ownerIds,
      entityInfos,
      createdAt,
      startDate,
      endDate,
      resolvedDate,
    });

    this.typeIds = typeIds;
  }
}
