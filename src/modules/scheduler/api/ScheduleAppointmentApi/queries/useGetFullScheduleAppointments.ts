import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  SCHEDULE_APPOINTMENTS_LIMIT,
  type GetScheduleAppointmentsQueryParams,
} from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetPaginatedScheduleAppointments = ({
  page,
  queryParams,
}: {
  page: number;
  queryParams: GetScheduleAppointmentsQueryParams;
}) => {
  const offset = (page - 1) * SCHEDULE_APPOINTMENTS_LIMIT;

  return useQuery({
    queryKey: SCHEDULER_QUERY_KEYS.fullScheduleAppointments({ ...queryParams, offset }),
    queryFn: () =>
      scheduleAppointmentApi.getPaginatedScheduleAppointments({ ...queryParams, offset }),
    placeholderData: keepPreviousData,
  });
};
