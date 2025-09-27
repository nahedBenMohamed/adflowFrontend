import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { EntityFieldFilter } from '../EntityFieldFilters/EntityFieldFilter';
import type { EntitySorting } from './EntitySorting';
import type { EntityTaskFilter } from './EntityTaskFilter';

export class EntityBoardCardFilter {
  fields?: Nullable<EntityFieldFilter[]>;
  createdAt?: EntityCreatedAtFilter;
  sorting?: EntitySorting;
  includeStageIds?: Nullable<number[]>;
  excludeStageIds?: Nullable<number[]>;
  search?: Nullable<string>;
  ownerIds?: Nullable<number[]>;
  closedAt?: EntityCreatedAtFilter;
  tasks?: Nullable<EntityTaskFilter>;

  constructor({
    fields,
    createdAt,
    sorting,
    includeStageIds,
    excludeStageIds,
    search,
    ownerIds,
    closedAt,
    tasks,
  }: EntityBoardCardFilter) {
    this.fields = fields;
    this.createdAt = createdAt;
    this.sorting = sorting;
    this.includeStageIds = includeStageIds;
    this.excludeStageIds = excludeStageIds;
    this.search = search;
    this.ownerIds = ownerIds;
    this.closedAt = closedAt;
    this.tasks = tasks;
  }
}
