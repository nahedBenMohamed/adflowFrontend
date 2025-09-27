import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { TaskSorting } from '../../../shared';

export abstract class BaseTaskBoardFilterDto {
  search?: Nullable<string>;
  sorting?: Nullable<TaskSorting>;
  showResolved?: Nullable<boolean>;
  ownerIds?: Nullable<number[]>;
  createdBy?: Nullable<number[]>;
  entityIds?: Nullable<number[]>;
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
    entityIds,
    createdAt,
    startDate,
    endDate,
    resolvedDate,
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
  }) {
    this.sorting = sorting;
    this.search = search;
    this.showResolved = showResolved;
    this.ownerIds = ownerIds;
    this.createdBy = createdBy;
    this.entityIds = entityIds;
    this.createdAt = createdAt;
    this.startDate = startDate;
    this.endDate = endDate;
    this.resolvedDate = resolvedDate;
  }
}
