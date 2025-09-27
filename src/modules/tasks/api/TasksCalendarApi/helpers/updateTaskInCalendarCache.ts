import type { QueryClient } from '@tanstack/react-query';
import type { BaseTask, TasksCalendarUseType } from '../../../shared';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';

export const updateTaskInCalendarCache = ({
  type,
  queryParams,
  queryClient,
  taskId,
  newTask,
}: {
  type: TasksCalendarUseType;
  queryParams: TasksForCalendarQueryParamsDto;
  queryClient: QueryClient;
  taskId: number;
  newTask: BaseTask;
}) => {
  switch (type) {
    case 'time_board': {
      queryClient.setQueryData<BaseTask[]>(
        TASKS_QUERY_KEYS.timeBoardTasksForCalendar(queryParams),
        prevData => (prevData ? [...prevData.filter(t => t.id !== taskId), newTask] : prevData)
      );

      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.timeBoardTasksForCalendarCount(queryParams),
      });

      break;
    }

    case 'tasks': {
      queryClient.setQueryData<BaseTask[]>(
        TASKS_QUERY_KEYS.tasksForCalendar(queryParams),
        prevData => (prevData ? [...prevData.filter(t => t.id !== taskId), newTask] : prevData)
      );

      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.tasksForCalendarCount(queryParams),
      });

      break;
    }

    case 'activities': {
      queryClient.setQueryData<BaseTask[]>(
        TASKS_QUERY_KEYS.activitiesForCalendar(queryParams),
        prevData => (prevData ? [...prevData.filter(t => t.id !== taskId), newTask] : prevData)
      );

      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.activitiesForCalendarCount(queryParams),
      });

      break;
    }
  }
};
