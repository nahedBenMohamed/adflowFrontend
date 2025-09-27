import { queryClient } from '@/index';
import type { Optional } from '@/shared';
import type { Updater } from '@tanstack/react-query';
import type { Schedule } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const upsertScheduleToCache = async (schedule: Schedule): Promise<void> => {
  const updater: Updater<Optional<Schedule[]>, Optional<Schedule[]>> = (
    prev: Optional<Schedule[]>
  ) => {
    if (prev) {
      const alreadyExists = prev.find(s => s.id === schedule.id);

      if (alreadyExists) return prev.map<Schedule>(s => (s.id === schedule.id ? schedule : s));

      return [schedule, ...prev];
    }

    return [];
  };

  queryClient.setQueryData<Schedule[]>(SCHEDULER_QUERY_KEYS.schedules(), updater);
};
