import { queryClient } from '@/index';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const resetAllSchedulesQueries = async (): Promise<void> => {
  await queryClient.resetQueries({ queryKey: SCHEDULER_QUERY_KEYS.scheduler });
};
