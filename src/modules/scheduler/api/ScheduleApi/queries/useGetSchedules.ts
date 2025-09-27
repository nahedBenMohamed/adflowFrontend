import { useQuery } from '@tanstack/react-query';
import type { GetSchedulesQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleApi } from '../ScheduleApi';

export const useGetSchedules = (queryParams?: GetSchedulesQueryParams) =>
  useQuery({
    queryKey: SCHEDULER_QUERY_KEYS.schedules(queryParams),
    // 45 seconds –> this hook is called in Sidebar, to prevent spamming the server
    // when frequently switching between sections, or opening tutorial drawer
    staleTime: 45 * 1000,
    queryFn: () => scheduleApi.getSchedules(queryParams),
  });
