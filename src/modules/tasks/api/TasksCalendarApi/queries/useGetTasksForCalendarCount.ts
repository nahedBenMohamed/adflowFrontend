import { useQuery } from '@tanstack/react-query';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';
import { tasksCalendarApi } from '../TasksCalendarApi';

export const useGetTasksForCalendarCount = ({
  queryParams,
  enabled,
}: {
  queryParams: TasksForCalendarQueryParamsDto;
  enabled: boolean;
}) =>
  useQuery({
    queryKey: TASKS_QUERY_KEYS.tasksForCalendarCount(queryParams),
    queryFn: () => {
      if (queryParams.boardId === null) {
        return tasksCalendarApi.getActivitiesForCalendarCount(queryParams);
      } else {
        return tasksCalendarApi.getTasksForCalendarCount(queryParams);
      }
    },
    enabled,
  });
