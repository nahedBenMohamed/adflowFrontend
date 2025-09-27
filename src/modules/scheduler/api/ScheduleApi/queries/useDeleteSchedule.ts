import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleApi } from '../ScheduleApi';

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) => scheduleApi.deleteSchedule(scheduleId),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: SCHEDULER_QUERY_KEYS.schedules() });

      queryClient.invalidateQueries({ queryKey: SCHEDULER_QUERY_KEYS.schedules() });
    },
  });
};
