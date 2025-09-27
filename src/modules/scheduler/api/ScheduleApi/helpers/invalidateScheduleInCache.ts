import { queryClient } from '@/index';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const invalidateScheduleInCache = (scheduleId: number): Promise<void> =>
  queryClient.invalidateQueries({ queryKey: SCHEDULER_QUERY_KEYS.schedule(scheduleId) });
