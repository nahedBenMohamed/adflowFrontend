import { useQuery } from '@tanstack/react-query';
import type { GetScheduleAppointmentCountQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetLastScheduleAppointment = ({
  queryParams,
  openedFromCard,
}: {
  queryParams: GetScheduleAppointmentCountQueryParams;
  openedFromCard: boolean;
}) => {
  return useQuery({
    enabled: openedFromCard,
    queryKey: SCHEDULER_QUERY_KEYS.scheduleLastAppointment(queryParams),
    queryFn: () => scheduleAppointmentApi.getLastScheduleAppointment(queryParams),
  });
};
