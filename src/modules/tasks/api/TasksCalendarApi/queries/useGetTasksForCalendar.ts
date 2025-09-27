import { useQuery } from '@tanstack/react-query';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';
import { tasksCalendarApi } from '../TasksCalendarApi';

export const useGetTasksForCalendar = ({
  queryParams,
  enabled,
}: {
  queryParams: TasksForCalendarQueryParamsDto;
  enabled: boolean;
}) =>
  useQuery({
    queryKey: TASKS_QUERY_KEYS.tasksForCalendar(queryParams),
    queryFn: () => tasksCalendarApi.getTasksForCalendar(queryParams),
    enabled,
  });
