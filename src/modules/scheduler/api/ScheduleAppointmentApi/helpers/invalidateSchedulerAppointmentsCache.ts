import { queryClient } from '@/index';
import type { GetScheduleAppointmentCountQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const invalidateSchedulerAppointmentsCache = (
  queryParams: GetScheduleAppointmentCountQueryParams
): void => {
  queryClient.invalidateQueries({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
  });
};
