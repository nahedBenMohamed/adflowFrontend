import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { BaseTask, type DeadlineType, type TaskView } from '../../shared';
import { DEFAULT_CARDS_LIMIT } from '../TaskApi/TaskApi';
import type { UserTimeAllocation } from '../TaskBoardApi/TaskBoardApi';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { TimeBoardFilterDto } from '../dtos';

type TimeBoardMeta = Record<DeadlineType, Nullable<TimeBoardStageMeta>> & {
  timeAllocation: UserTimeAllocation[];
};

interface TimeBoardStageMeta {
  total: number;
  timeAllocation: UserTimeAllocation[];
}

class TimeBoardApi {
  getCardsByTime = async (
    filter: TimeBoardFilterDto,
    offset: Nullable<number> = null
  ): Promise<BaseTask[]> => {
    const response = await baseApi.post(TasksApiRoutes.GET_TASK_CARDS_BY_TIME, filter, {
      params: {
        limit: DEFAULT_CARDS_LIMIT,
        offset,
      },
    });

    return BaseTask.fromCardDtos(response.data);
  };

  getCardByTime = async ({
    type,
    taskId,
    filter,
  }: {
    type: TaskView;
    taskId: number;
    filter: TimeBoardFilterDto;
  }): Promise<Nullable<BaseTask>> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARD_BY_TIME, { type, taskId }),
      filter
    );

    if (!response.data) return null;

    return BaseTask.fromBaseCardDto(response.data);
  };

  getCardsByTimeMeta = async (filter: TimeBoardFilterDto): Promise<TimeBoardMeta> => {
    const response = await baseApi.post(TasksApiRoutes.GET_TASK_CARDS_BY_TIME_META, filter);

    return response.data;
  };
}

export const timeBoardApi = new TimeBoardApi();
