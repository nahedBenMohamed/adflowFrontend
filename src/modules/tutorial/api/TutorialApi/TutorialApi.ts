import { baseApi } from '@/app';
import { UrlTemplateUtil, type TutorialProductType } from '@/shared';
import { TutorialGroup, TutorialItem } from '../../shared';
import { TutorialApiRoutes } from '../TutorialApiRoutes';
import type {
  CreateTutorialGroupDto,
  SortOrderListDto,
  UpdateTutorialGroupDto,
  UpdateTutorialItemDto,
} from '../dtos';

export interface GetExpandedTutorialGroupsQueryParams {
  userId?: number;
  objectId?: number;
  productType?: TutorialProductType;
}

export interface GetTutorialCountQueryParams {
  from?: string;
  userId?: number;
  objectId?: number;
  productType?: TutorialProductType;
}

export interface DeleteTutorialGroupItemResult {
  deletedFromGroupId: number;
  deletedItemId: number;
}

class TutorialApi {
  getExpandedTutorialGroups = async ({
    userId,
    objectId,
    productType,
  }: GetExpandedTutorialGroupsQueryParams): Promise<TutorialGroup[]> => {
    const response = await baseApi.get(TutorialApiRoutes.GET_TUTORIAL_GROUPS, {
      // expand allows to expand nested entities, e.g. 'items', if multiple entities are needed, separate them with comma
      // e.g. 'items,items.products' (in this case this is not needed)
      params: { userId, productType, objectId, expand: 'items' },
    });

    return TutorialGroup.fromDtos(response.data);
  };

  getTutorialCount = async ({
    from,
    userId,
    objectId,
    productType,
  }: GetTutorialCountQueryParams): Promise<number> => {
    const response = await baseApi.get(TutorialApiRoutes.GET_TUTORIAL_COUNT, {
      params: { userId, productType, objectId, from },
    });

    return response.data;
  };

  getTutorialGroup = async ({
    groupId,
    expand,
  }: {
    groupId: number;
    expand?: string;
  }): Promise<TutorialGroup> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TutorialApiRoutes.GET_TUTORIAL_GROUP, { groupId }),
      {
        params: { expand },
      }
    );

    return TutorialGroup.fromDto(response.data);
  };

  createTutorialGroup = async (dto: CreateTutorialGroupDto): Promise<TutorialGroup> => {
    const response = await baseApi.post(TutorialApiRoutes.CREATE_TUTORIAL_GROUP, dto);

    return TutorialGroup.fromDto(response.data);
  };

  updateTutorialGroup = async ({
    groupId,
    dto,
  }: {
    groupId: number;
    dto: UpdateTutorialGroupDto;
  }): Promise<TutorialGroup> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TutorialApiRoutes.UPDATE_TUTORIAL_GROUP, { groupId }),
      dto
    );

    return TutorialGroup.fromDto(response.data);
  };

  deleteTutorialGroup = async (groupId: number): Promise<number> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TutorialApiRoutes.DELETE_TUTORIAL_GROUP, { groupId })
    );

    return groupId;
  };

  getTutorialGroupItems = async (groupId: number): Promise<TutorialItem[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TutorialApiRoutes.GET_TUTORIAL_ITEMS, { groupId })
    );

    return TutorialItem.fromDtos(response.data);
  };

  getTutorialGroupItem = async ({
    groupId,
    itemId,
  }: {
    groupId: number;
    itemId: number;
  }): Promise<TutorialItem> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TutorialApiRoutes.GET_TUTORIAL_ITEM, { groupId, itemId })
    );

    return TutorialItem.fromDto(response.data);
  };

  createTutorialGroupItem = async ({
    groupId,
    dto,
  }: {
    groupId: number;
    dto: UpdateTutorialItemDto;
  }): Promise<TutorialItem> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TutorialApiRoutes.CREATE_TUTORIAL_ITEM, { groupId }),
      dto
    );

    return TutorialItem.fromDto(response.data);
  };

  updateTutorialGroupItem = async ({
    groupId,
    itemId,
    dto,
  }: {
    groupId: number;
    itemId: number;
    dto: UpdateTutorialItemDto;
  }): Promise<TutorialItem> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TutorialApiRoutes.UPDATE_TUTORIAL_ITEM, { groupId, itemId }),
      dto
    );

    return TutorialItem.fromDto(response.data);
  };

  deleteTutorialGroupItem = async ({
    groupId,
    itemId,
  }: {
    groupId: number;
    itemId: number;
  }): Promise<DeleteTutorialGroupItemResult> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TutorialApiRoutes.DELETE_TUTORIAL_ITEM, { groupId, itemId })
    );

    return { deletedFromGroupId: groupId, deletedItemId: itemId };
  };

  changeGroupsSortOrder = async (dto: SortOrderListDto): Promise<void> => {
    await baseApi.patch(TutorialApiRoutes.CHANGE_GROUPS_SORT_ORDER, dto);
  };

  changeItemsSortOrder = async ({
    groupId,
    dto,
  }: {
    groupId: number;
    dto: SortOrderListDto;
  }): Promise<void> => {
    await baseApi.patch(
      UrlTemplateUtil.toPath(TutorialApiRoutes.CHANGE_ITEMS_SORT_ORDER, { groupId }),
      dto
    );
  };
}

export const tutorialApi = new TutorialApi();
