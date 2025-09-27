import { queryClient } from '@/index';
import type { Schedule } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleApi } from '../ScheduleApi';

export const getSchedule = async (scheduleId: number): Promise<Schedule> => {
  return await queryClient.fetchQuery({
    queryKey: SCHEDULER_QUERY_KEYS.schedule(scheduleId),
    queryFn: () => scheduleApi.getSchedule(scheduleId),
  });
};
