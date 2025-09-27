import { PagingMeta } from '@/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { GetScheduleAppointmentsQueryParams } from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetInfiniteScheduleAppointments = (
  queryParams: GetScheduleAppointmentsQueryParams
) =>
  useInfiniteQuery({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
    queryFn: ({ pageParam }) =>
      scheduleAppointmentApi.getPaginatedScheduleAppointments({
        ...queryParams,
        offset: pageParam.offset,
      }),
    initialPageParam: new PagingMeta(0, 0),
    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset || !lastPage.appointments.length ? undefined : lastPage.meta;
    },
  });
