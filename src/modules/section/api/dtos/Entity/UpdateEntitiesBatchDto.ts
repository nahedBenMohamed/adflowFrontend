import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { EntityFieldFilter, EntitySorting } from '../../../shared';

export class UpdateEntitiesBatchDto {
  entityIds?: number[];
  stageId?: Nullable<number>;
  responsibleUserId?: Nullable<number>;
  responsibleEntityTypeIds?: number[];

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
    stageId,
    responsibleUserId,
    responsibleEntityTypeIds,
    fields,
    createdAt,
    sorting,
    stageIds,
    systemStageIds,
    search,
    ownerIds,
    closedAt,
  }: UpdateEntitiesBatchDto) {
    this.entityIds = entityIds;
    this.stageId = stageId;
    this.responsibleUserId = responsibleUserId;
    this.responsibleEntityTypeIds = responsibleEntityTypeIds;
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
