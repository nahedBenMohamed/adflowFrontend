import { queryClient } from '@/index';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const invalidateSchedulerStatisticsCache = async () =>
  await queryClient.invalidateQueries({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointmentStatistics({}).slice(0, 2),
  });
