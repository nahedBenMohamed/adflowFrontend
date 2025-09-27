import { useQuery } from '@tanstack/react-query';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleApi } from '../ScheduleApi';

export const useGetSchedule = ({
  scheduleId,
  refetchOnWindowFocus,
}: {
  scheduleId: number;
  refetchOnWindowFocus?: boolean;
}) =>
  useQuery({
    // schedules usually doesn't change often, so we can set longer staleTime to refetch it less often
    staleTime: 5 * 1000,
    refetchOnWindowFocus,
    queryKey: SCHEDULER_QUERY_KEYS.schedule(scheduleId),
    queryFn: () => scheduleApi.getSchedule(scheduleId),
  });
