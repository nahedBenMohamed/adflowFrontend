import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { BaseTask, type Activity } from '../../shared';
import { DEFAULT_CARDS_LIMIT } from '../TaskApi/TaskApi';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { ActivityCardsFilterDto } from '../dtos';

export interface ActivityCardsMeta {
  total: number;
  types: ActivityCardByTypeMeta[];
  resolvedTotal: number;
}

export interface ActivityCardByTypeMeta {
  id: number;
  totalCount: number;
}

class ActivityBoardApi {
  getActivityCardsByType = async (
    filter: ActivityCardsFilterDto,
    offset: Nullable<number> = null
  ): Promise<Activity[]> => {
    const response = await baseApi.post(TasksApiRoutes.GET_ACTIVITY_CARDS_BY_TYPE, filter, {
      params: {
        limit: DEFAULT_CARDS_LIMIT,
        offset,
      },
    });

    return BaseTask.fromCardDtos(response.data) as Activity[];
  };

  getActivityCard = async ({
    activityId,
    filter,
  }: {
    activityId: number;
    filter: ActivityCardsFilterDto;
  }): Promise<Nullable<Activity>> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_ACTIVITY_CARD, { activityId }),
      filter
    );

    return response.data ? (BaseTask.fromBaseCardDto(response.data) as Activity) : null;
  };

  getActivityCardsMeta = async (filter: ActivityCardsFilterDto): Promise<ActivityCardsMeta> => {
    const response = await baseApi.post(TasksApiRoutes.GET_ACTIVITY_CARDS_META, filter);

    return response.data;
  };
}

export const activityBoardApi = new ActivityBoardApi();
