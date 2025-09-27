import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { EntityFieldFilter, EntitySorting } from '../../../shared';

export class DeleteEntitiesBatchDto {
  entityIds?: number[];

  fields?: Nullable<EntityFieldFilter[]>;
  createdAt?: EntityCreatedAtFilter;
  sorting?: EntitySorting;
  stageIds?: Nullable<number[]>;
  systemStageIds?: Nullable<number[]>;
  search?: Nullable<string>;
  ownerIds?: Nullable<number[]>;
  closedAt?: EntityCreatedAtFilter;

  constructor({
    entityIds,
    fields,
    createdAt,
    sorting,
    stageIds,
    systemStageIds,
    search,
    ownerIds,
    closedAt,
  }: DeleteEntitiesBatchDto) {
    this.entityIds = entityIds;
    this.fields = fields;
    this.createdAt = createdAt;
    this.sorting = sorting;
    this.stageIds = stageIds;
    this.systemStageIds = systemStageIds;
    this.search = search;
    this.ownerIds = ownerIds;
    this.closedAt = closedAt;
  }
}
