import { useQuery } from '@tanstack/react-query';
import type { GetScheduleAppointmentCountQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetSchedulerTotalVisits = (queryParams: GetScheduleAppointmentCountQueryParams) =>
  useQuery({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointmentCount(queryParams),
    queryFn: () => scheduleAppointmentApi.getScheduleAppointmentCount(queryParams),
  });
