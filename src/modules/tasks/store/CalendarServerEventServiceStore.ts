import { serverEventService } from '@/shared';
import type { QueryClient } from '@tanstack/react-query';
import { makeAutoObservable } from 'mobx';
import {
  deleteTaskFromCalendarCache,
  TASKS_QUERY_KEYS,
  type TasksForCalendarQueryParamsDto,
} from '../api';
import { type TasksCalendarUseType } from '../shared';

export class CalendarServerEventServiceStore {
  type: TasksCalendarUseType;
  queryParams: TasksForCalendarQueryParamsDto;
  queryClient: QueryClient;

  constructor({
    type,
    queryParams,
    queryClient,
  }: {
    type: TasksCalendarUseType;
    queryParams: TasksForCalendarQueryParamsDto;
    queryClient: QueryClient;
  }) {
    this.type = type;
    this.queryParams = queryParams;
    this.queryClient = queryClient;

    makeAutoObservable(this);
  }

  reset = () => {
    this._unsubscribe();
  };

  subscribe = (): void => {
    serverEventService.on('task:created', this._taskUpdatedHandler);
    serverEventService.on('task:updated', this._taskUpdatedHandler);
    serverEventService.on<number>('task:deleted', async (...args: number[]) => {
      if (args[0]) await this._taskDeletedHandler(args[0]);
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('task:created');
    serverEventService.off('task:updated');
    serverEventService.off('task:deleted');
  };

  private _taskUpdatedHandler = async (): Promise<void> => {
    switch (this.type) {
      case 'tasks': {
        await this.queryClient.invalidateQueries({
          queryKey: TASKS_QUERY_KEYS.tasksForCalendar(this.queryParams),
        });

        break;
      }

      case 'activities': {
        await this.queryClient.invalidateQueries({
          queryKey: TASKS_QUERY_KEYS.activitiesForCalendar(this.queryParams),
        });

        break;
      }

      case 'time_board': {
        await this.queryClient.invalidateQueries({
          queryKey: TASKS_QUERY_KEYS.timeBoardTasksForCalendar(this.queryParams),
        });

        break;
      }
    }
  };

  private _taskDeletedHandler = async (taskId: number): Promise<void> => {
    deleteTaskFromCalendarCache({
      type: this.type,
      queryParams: this.queryParams,
      queryClient: this.queryClient,
      taskId: taskId,
    });
  };
}
