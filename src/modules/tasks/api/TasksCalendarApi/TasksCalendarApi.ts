import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { TaskCalendarMeta } from '../../shared';
import { BaseTask, type Activity, type Task } from '../../shared/';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { TasksForCalendarQueryParamsDto } from '../dtos';

class TasksCalendarApi {
  getTasksForCalendar = async ({
    boardId,
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<Task[]> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_CALENDAR, { boardId }),
      filter,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return BaseTask.fromCardDtos(response.data) as Task[];
  };

  getTasksForCalendarCount = async ({
    boardId,
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<number> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_CARDS_CALENDAR_META, { boardId }),
      filter,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return TaskCalendarMeta.fromDto(response.data).total;
  };

  getActivitiesForCalendar = async ({
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<Activity[]> => {
    const response = await baseApi.post(TasksApiRoutes.GET_ACTIVITY_CARDS_FOR_CALENDAR, filter, {
      params: {
        startDate,
        endDate,
      },
    });

    return BaseTask.fromCardDtos(response.data) as Activity[];
  };

  getActivitiesForCalendarCount = async ({
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<number> => {
    const response = await baseApi.post(
      TasksApiRoutes.GET_ACTIVITY_CARDS_FOR_CALENDAR_META,
      filter,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return TaskCalendarMeta.fromDto(response.data).total;
  };

  getTimeBoardTasksForCalendar = async ({
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<BaseTask[]> => {
    const response = await baseApi.post(
      TasksApiRoutes.GET_TASK_CARDS_BY_TIME_FOR_CALENDAR,
      filter,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return BaseTask.fromCardDtos(response.data);
  };

  getTimeBoardTasksForCalendarCount = async ({
    startDate,
    endDate,
    filter,
  }: TasksForCalendarQueryParamsDto): Promise<number> => {
    const response = await baseApi.post(
      TasksApiRoutes.GET_TASK_CARDS_BY_TIME_FOR_CALENDAR_META,
      filter,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return TaskCalendarMeta.fromDto(response.data).total;
  };
}

export const tasksCalendarApi = new TasksCalendarApi();
