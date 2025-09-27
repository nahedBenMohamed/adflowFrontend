import { baseApi } from '@/app';
import type { FieldValueDto } from '@/modules/fields';
import { Entity, FileLink, UrlTemplateUtil, type EntityInfo, type Nullable } from '@/shared';
import {
  EntityBoardCard,
  EntityListItem,
  FullEntitiesSearchResult,
  SearchByValueResult,
  type EntityBoardCardFilter,
  type EntitySearchFilter,
  type SearchByFieldResult,
} from '../../shared';
import { SectionApiRoutes } from '../SectionApiRoutes';
import {
  type CreateSimpleEntityDto,
  type DeleteEntitiesBatchDto,
  type SearchByFieldFilter,
  type UpdateEntitiesBatchDto,
  type UpdateEntityDto,
} from '../dtos';

export interface EntityBoardStageMeta {
  id: number;
  totalCount: number;
  totalPrice: number;
}

export interface EntityBoardMeta {
  totalCount: number;
  totalPrice: number;
  hasPrice: boolean;
  stages: EntityBoardStageMeta[];
}

export interface EntityListMeta {
  totalCount: number;
  totalPrice: number;
  hasPrice: boolean;
}

export const DEFAULT_ENTITY_LIST_ITEMS_LIMIT = 40;
const DEFAULT_ENTITY_CARDS_LIMIT = 20;
const DEFAULT_ENTITY_SEARCH_LIMIT = 40;

class EntityApi {
  getEntitiesBoardCards = async ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter?: Nullable<EntityBoardCardFilter>;
  }): Promise<EntityBoardCard[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITIES_BOARD_CARDS, {
        entityTypeId,
        boardId,
      }),
      filter,
      {
        params: {
          limit: DEFAULT_ENTITY_CARDS_LIMIT,
        },
      }
    );

    return EntityBoardCard.fromDtos(response.data);
  };

  loadMoreEntitiesBoardCards = async ({
    entityTypeId,
    boardId,
    offset,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    offset?: Nullable<number>;
    filter?: Nullable<EntityBoardCardFilter>;
  }): Promise<EntityBoardCard[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITIES_BOARD_CARDS, {
        entityTypeId,
        boardId,
      }),
      filter,
      {
        params: {
          limit: DEFAULT_ENTITY_CARDS_LIMIT,
          offset,
        },
      }
    );

    return EntityBoardCard.fromDtos(response.data);
  };

  getEntitiesBoardCard = async ({
    entityTypeId,
    boardId,
    entityId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    entityId: number;
    filter?: Nullable<EntityBoardCardFilter>;
  }): Promise<Nullable<EntityBoardCard>> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITIES_BOARD_CARD, {
        entityTypeId,
        boardId,
        entityId,
      }),
      filter
    );

    return response.data ? EntityBoardCard.fromDto(response.data) : null;
  };

  getEntitiesBoardMeta = async ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter?: Nullable<EntityBoardCardFilter>;
  }): Promise<EntityBoardMeta> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITIES_BOARD_META, {
        entityTypeId,
        boardId,
      }),
      filter
    );

    return response.data;
  };

  getEntityListItems = async ({
    entityTypeId,
    filter,
    limit,
    offset,
    boardId,
  }: {
    entityTypeId: number;
    filter: EntityBoardCardFilter;
    limit?: number;
    offset?: Nullable<number>;
    boardId?: Nullable<number>;
  }): Promise<EntityListItem[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY_LIST_ITEMS, { entityTypeId }),
      filter,
      {
        params: {
          offset,
          boardId,
          limit: limit ?? DEFAULT_ENTITY_LIST_ITEMS_LIMIT,
        },
      }
    );

    return EntityListItem.fromDtos(response.data);
  };

  getEntityListItem = async ({
    entityTypeId,
    entityId,
    filter,
  }: {
    entityTypeId: number;
    entityId: number;
    filter: EntityBoardCardFilter;
  }): Promise<Nullable<EntityListItem>> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY_LIST_ITEM, {
        entityTypeId,
        entityId,
      }),
      filter
    );

    return response.data ? EntityListItem.fromDto(response.data) : null;
  };

  getEntityListMeta = async ({
    entityTypeId,
    filter,
    boardId,
  }: {
    entityTypeId: number;
    filter: EntityBoardCardFilter;
    boardId?: Nullable<number>;
  }): Promise<EntityListMeta> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY_LIST_META, { entityTypeId }),
      filter,
      {
        params: {
          boardId,
        },
      }
    );

    return response.data;
  };

  getEntityById = async (id: number): Promise<Entity> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY, { id }));

    return Entity.fromDto(response.data);
  };

  getEntityInfoById = async (id: number): Promise<EntityInfo> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY_INFO, { entityId: id })
    );

    return response.data;
  };

  createSimpleEntity = async (dto: CreateSimpleEntityDto): Promise<EntityInfo[]> => {
    const response = await baseApi.post(SectionApiRoutes.CREATE_SIMPLE_ENTITY, dto);

    return response.data;
  };

  updateEntity = async ({ id, dto }: { id: number; dto: UpdateEntityDto }): Promise<Entity> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(SectionApiRoutes.UPDATE_ENTITY, { id }),
      dto
    );

    return Entity.fromDto(response.data);
  };

  deleteEntity = async (id: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(SectionApiRoutes.DELETE_ENTITY, { id }));
  };

  searchEntities = async (dto: EntitySearchFilter): Promise<SearchByValueResult> => {
    const response = await baseApi.post(SectionApiRoutes.SEARCH_ENTITIES, dto, {
      params: {
        limit: dto.limit ?? DEFAULT_ENTITY_SEARCH_LIMIT,
        offset: dto.offset,
      },
    });

    return SearchByValueResult.fromDto(response.data);
  };

  searchEntitiesFull = async (filter: EntitySearchFilter): Promise<FullEntitiesSearchResult> => {
    const response = await baseApi.post(SectionApiRoutes.SEARCH_ENTITIES_FULL, filter, {
      params: {
        limit: filter.limit ?? DEFAULT_ENTITY_SEARCH_LIMIT,
        offset: filter.offset,
      },
    });

    return FullEntitiesSearchResult.fromDto(response.data);
  };

  findOneEntityForCall = async (filter: SearchByFieldFilter): Promise<SearchByFieldResult> => {
    const response = await baseApi.post(SectionApiRoutes.FIND_ONE_ENTITY_FOR_CALL, filter);

    return response.data;
  };

  getEntityFiles = async (entityId: number): Promise<FileLink[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SectionApiRoutes.GET_ENTITY_FILES, { id: entityId })
    );

    return FileLink.fromDtos(response.data);
  };

  addEntityFiles = async ({
    entityId,
    fileIds,
  }: {
    entityId: number;
    fileIds: string[];
  }): Promise<FileLink[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.ADD_ENTITY_FILES, { id: entityId }),
      { fileIds }
    );

    return FileLink.fromDtos(response.data);
  };

  saveFieldValue = async ({
    entityId,
    dto,
  }: {
    entityId: number;
    dto: FieldValueDto<unknown>;
  }): Promise<void> => {
    await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.SAVE_ENTITY_FIELD_VALUE, {
        id: entityId,
        fieldId: dto.fieldId,
      }),
      dto
    );
  };

  batchUpdateEntities = async ({
    entityTypeId,
    boardId,
    dto,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
    dto: UpdateEntitiesBatchDto;
  }): Promise<void> => {
    await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.BATCH_UPDATE_ENTITIES, { entityTypeId }),
      dto,
      { params: { boardId } }
    );
  };

  batchDeleteEntities = async ({
    entityTypeId,
    boardId,
    dto,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
    dto: DeleteEntitiesBatchDto;
  }): Promise<void> => {
    await baseApi.post(
      UrlTemplateUtil.toPath(SectionApiRoutes.BATCH_DELETE_ENTITIES, { entityTypeId }),
      dto,
      { params: { boardId } }
    );
  };
}

export const entityApi = new EntityApi();
