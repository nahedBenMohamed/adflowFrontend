import type { Entity, EntityInfo, Nullable } from '@/shared';
import {
  CreateSimpleEntityDto,
  UpdateEntityDto,
  entityApi,
  type DeleteEntitiesBatchDto,
  type SearchByFieldFilter,
  type UpdateEntitiesBatchDto,
} from '../../../api';
import type {
  EntitySearchFilter,
  FullEntitiesSearchResult,
  SearchByFieldResult,
  SearchByValueResult,
} from '../models';

export class EntityApiUtil {
  static async createSimple(dto: CreateSimpleEntityDto): Promise<EntityInfo[]> {
    return await entityApi.createSimpleEntity(dto);
  }

  static async save(entity: Entity, linkedEntityIds?: number[]): Promise<Entity> {
    if (entity.isNew) {
      const shortInfos = await this.createSimple(
        CreateSimpleEntityDto.fromEntity(entity, linkedEntityIds)
      );

      if (!shortInfos[0])
        throw new Error(`Failed to create simple entity from entity ${entity.id}`);

      return await EntityApiUtil.getById(shortInfos[0].id);
    }

    return await this.update({ id: entity.id, dto: UpdateEntityDto.fromModel(entity) });
  }

  static async update({ id, dto }: { id: number; dto: UpdateEntityDto }): Promise<Entity> {
    return await entityApi.updateEntity({ id, dto });
  }

  static async delete(id: number): Promise<void> {
    await entityApi.deleteEntity(id);
  }

  static async getById(id: number): Promise<Entity> {
    return await entityApi.getEntityById(id);
  }

  static async getInfoById(id: number): Promise<EntityInfo> {
    return await entityApi.getEntityInfoById(id);
  }

  static async searchEntities(dto: EntitySearchFilter): Promise<SearchByValueResult> {
    return await entityApi.searchEntities(dto);
  }

  static async searchEntitiesByFieldFull(
    filter: EntitySearchFilter
  ): Promise<FullEntitiesSearchResult> {
    return await entityApi.searchEntitiesFull(filter);
  }

  static async findOneEntityForCall(filter: SearchByFieldFilter): Promise<SearchByFieldResult> {
    return await entityApi.findOneEntityForCall(filter);
  }

  static async batchUpdateEntities({
    entityTypeId,
    boardId,
    dto,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
    dto: UpdateEntitiesBatchDto;
  }): Promise<void> {
    await entityApi.batchUpdateEntities({ entityTypeId, boardId, dto });
  }

  static async batchDeleteEntities({
    entityTypeId,
    boardId,
    dto,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
    dto: DeleteEntitiesBatchDto;
  }): Promise<void> {
    await entityApi.batchDeleteEntities({ entityTypeId, boardId, dto });
  }
}
