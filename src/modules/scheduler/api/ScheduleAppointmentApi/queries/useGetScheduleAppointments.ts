import { useQuery } from '@tanstack/react-query';
import type { GetScheduleAppointmentsQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetScheduleAppointments = ({
  queryParams,
  enabled,
}: {
  queryParams: GetScheduleAppointmentsQueryParams;
  enabled: boolean;
}) =>
  useQuery({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
    queryFn: () => scheduleAppointmentApi.getScheduleAppointments(queryParams),
    enabled,
  });
