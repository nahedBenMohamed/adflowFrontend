import type { EntityCreatedAtFilter, EntityInfo, Nullable } from '@/shared';
import type { TaskSorting } from './TaskSorting';

export class BaseTaskBoardFilter {
  search?: Nullable<string>;
  sorting?: Nullable<TaskSorting>;
  showResolved?: Nullable<boolean>;
  createdBy?: Nullable<number[]>;
  ownerIds?: Nullable<number[]>;
  entityInfos?: Nullable<EntityInfo[]>;
  createdAt?: EntityCreatedAtFilter;
  startDate?: EntityCreatedAtFilter;
  endDate?: EntityCreatedAtFilter;
  resolvedDate?: EntityCreatedAtFilter;

  constructor({
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
  }: {
    sorting?: Nullable<TaskSorting>;
    search?: Nullable<string>;
    showResolved?: Nullable<boolean>;
    createdBy?: Nullable<number[]>;
    ownerIds?: Nullable<number[]>;
    entityInfos?: Nullable<EntityInfo[]>;
    createdAt?: EntityCreatedAtFilter;
    startDate?: EntityCreatedAtFilter;
    endDate?: EntityCreatedAtFilter;
    resolvedDate?: EntityCreatedAtFilter;
  }) {
    this.sorting = sorting;
    this.search = search;
    this.showResolved = showResolved;
    this.createdBy = createdBy;
    this.ownerIds = ownerIds;
    this.entityInfos = entityInfos;
    this.createdAt = createdAt;
    this.startDate = startDate;
    this.endDate = endDate;
    this.resolvedDate = resolvedDate;
  }
}
