import type { QueryClient } from '@tanstack/react-query';
import type { BaseTask, TasksCalendarUseType } from '../../../shared';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';

export const addTaskToCalendarCache = ({
  type,
  queryParams,
  queryClient,
  createdTask,
}: {
  type: Omit<TasksCalendarUseType, 'activities'>;
  queryParams: TasksForCalendarQueryParamsDto;
  queryClient: QueryClient;
  createdTask: BaseTask;
}) => {
  switch (type) {
    case 'time_board': {
      queryClient.setQueryData<BaseTask[]>(
        TASKS_QUERY_KEYS.timeBoardTasksForCalendar(queryParams),
        prevData => (prevData ? [...prevData, createdTask] : prevData)
      );

      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.timeBoardTasksForCalendarCount(queryParams),
      });

      break;
    }

    case 'tasks': {
      queryClient.setQueryData<BaseTask[]>(
        TASKS_QUERY_KEYS.tasksForCalendar(queryParams),
        prevData => (prevData ? [...prevData, createdTask] : prevData)
      );

      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.tasksForCalendarCount(queryParams),
      });

      break;
    }
  }
};
