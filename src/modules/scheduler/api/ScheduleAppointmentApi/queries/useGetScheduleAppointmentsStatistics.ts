import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { GetScheduleAppointmentsQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetScheduleAppointmentsStatistics = ({
  queryParams,
  enabled,
  refetchOnWindowFocus,
}: {
  queryParams: GetScheduleAppointmentsQueryParams;
  enabled: boolean;
  refetchOnWindowFocus?: boolean;
}) =>
  useQuery({
    enabled,
    refetchOnWindowFocus,
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointmentStatistics(queryParams),
    queryFn: () => scheduleAppointmentApi.getScheduleAppointmentStatistics(queryParams),
    placeholderData: keepPreviousData,
  });
