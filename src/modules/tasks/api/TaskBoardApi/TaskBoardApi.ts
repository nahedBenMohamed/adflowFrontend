import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { CARDS_LIST_LIMIT } from '..';
import { BaseTask, type Task } from '../../shared';
import { DEFAULT_CARDS_LIMIT } from '../TaskApi/TaskApi';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { TaskBoardFilterDto } from '../dtos';

export interface TaskBoardMeta {
  total: number;
  stages: TaskBoardStageMeta[];
  timeAllocation: UserTimeAllocation[];
}

interface TaskBoardStageMeta {
  id: number;
  total: number;
  timeAllocation: UserTimeAllocation[];
}

export interface UserTimeAllocation {
  userId: number;
  plannedTime: number;
}

export interface TaskListMeta {
  total: number;
  timeAllocation: UserTimeAllocation[];
}

class TaskBoardApi {
  getTaskBoardCards = async ({
    boardId,
    filter,
    offset = null,
  }: {
    boardId: number;
    filter: TaskBoardFilterDto;
    offset?: Nullable<number>;
  }): Promise<Task[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_BOARD, { boardId }),
      filter,
      {
        params: {
          limit: DEFAULT_CARDS_LIMIT,
          offset,
        },
      }
    );

    return BaseTask.fromCardDtos(response.data) as Task[];
  };

  getTaskBoardCard = async ({
    boardId,
    taskId,
    filter,
  }: {
    boardId: number;
    taskId: number;
    filter: TaskBoardFilterDto;
  }): Promise<Nullable<Task>> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARD, { taskId }),
      filter,
      {
        params: {
          boardId,
        },
      }
    );

    return response.data ? (BaseTask.fromBaseCardDto(response.data) as Task) : null;
  };

  getTaskBoardMeta = async ({
    boardId,
    filter,
  }: {
    boardId: number;
    filter: TaskBoardFilterDto;
  }): Promise<TaskBoardMeta> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_BOARD_META, { id: boardId }),
      filter
    );

    return response.data;
  };

  getTaskBoardCardsForList = async ({
    boardId,
    filter,
    offset = null,
  }: {
    boardId: number;
    filter: TaskBoardFilterDto;
    offset?: Nullable<number>;
  }): Promise<Task[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_LIST, { boardId }),
      filter,
      {
        params: {
          limit: CARDS_LIST_LIMIT,
          offset,
        },
      }
    );

    return BaseTask.fromCardDtos(response.data) as Task[];
  };

  getTasksListMeta = async ({
    boardId,
    filter,
  }: {
    boardId: number;
    filter: TaskBoardFilterDto;
  }): Promise<TaskListMeta> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_LIST_META, { boardId }),
      filter
    );

    return response.data;
  };
}

export const taskBoardApi = new TaskBoardApi();
