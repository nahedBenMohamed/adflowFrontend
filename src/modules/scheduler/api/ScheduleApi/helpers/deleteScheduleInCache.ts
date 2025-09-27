import { queryClient } from '@/index';
import type { Schedule } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const deleteScheduleInCache = async (scheduleId: number): Promise<void> => {
  queryClient.setQueryData<Schedule[]>(SCHEDULER_QUERY_KEYS.schedules(), prev =>
    prev?.filter(s => s.id !== scheduleId)
  );
};
