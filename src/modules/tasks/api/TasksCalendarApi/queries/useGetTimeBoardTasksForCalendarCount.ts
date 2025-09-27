import { useQuery } from '@tanstack/react-query';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';
import { tasksCalendarApi } from '../TasksCalendarApi';

export const useGetTimeBoardTasksForCalendarCount = ({
  queryParams,
  enabled,
}: {
  queryParams: TasksForCalendarQueryParamsDto;
  enabled: boolean;
}) =>
  useQuery({
    enabled,
    queryKey: TASKS_QUERY_KEYS.timeBoardTasksForCalendarCount(queryParams),
    queryFn: () => tasksCalendarApi.getTimeBoardTasksForCalendarCount(queryParams),
  });
