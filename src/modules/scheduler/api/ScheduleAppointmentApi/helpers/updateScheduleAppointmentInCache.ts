import { queryClient } from '@/index';
import { PagingMeta, arraysShallowEqual } from '@/shared';
import type { InfiniteData, Query, QueryKey } from '@tanstack/react-query';
import {
  type ScheduleAppointment,
  ScheduleAppointmentResult,
  ScheduleAppointmentStatus,
} from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

// schedule appointment query can store both one result and infinite result structure
// while in most cases one result is enough, infinite structure is used for example in 'AppointmentPlannedVisits'
// as long as we updating appointment in all queries matching predicate, we should support both structures
type ScheduleAppointmentQueryData =
  | ScheduleAppointmentResult
  | InfiniteData<ScheduleAppointmentResult>;

export const updateScheduleAppointmentInCache = async (
  appointment: ScheduleAppointment
): Promise<void> => {
  const predicate = (
    query: Query<
      ScheduleAppointmentQueryData | unknown,
      Error,
      ScheduleAppointmentQueryData | unknown,
      QueryKey
    >
  ) =>
    arraysShallowEqual({
      // find all queries no matter what params are
      arr1: query.queryKey.slice(0, SCHEDULER_QUERY_KEYS.scheduleAppointments({}).length - 1),
      arr2: SCHEDULER_QUERY_KEYS.scheduleAppointmentsWithoutParams(),
    });

  const resultFallback = new ScheduleAppointmentResult(new PagingMeta(0, 0), []);

  await queryClient.cancelQueries({
    predicate,
  });

  if (appointment.status === ScheduleAppointmentStatus.CANCELLED) {
    queryClient.setQueriesData<ScheduleAppointmentQueryData>({ predicate }, prev => {
      if (!prev) return resultFallback;

      if ('pages' in prev) {
        // Handle infinite query structure
        return {
          ...prev,
          pages: prev.pages.map(
            page =>
              new ScheduleAppointmentResult(
                { ...page.meta, total: page.meta.total - 1 },
                page.appointments.filter(a => a.id !== appointment.id)
              )
          ),
        };
      } else {
        return new ScheduleAppointmentResult(
          { ...prev.meta, total: prev.meta.total - 1 },
          prev.appointments.filter(a => a.id !== appointment.id)
        );
      }
    });

    return;
  }

  queryClient.setQueriesData<ScheduleAppointmentQueryData>({ predicate }, prev => {
    if (!prev) return resultFallback;

    if ('pages' in prev) {
      // Handle infinite query structure
      return {
        ...prev,
        pages: prev.pages.map(
          page =>
            new ScheduleAppointmentResult(
              page.meta,
              page.appointments.map(a => (a.id === appointment.id ? appointment : a))
            )
        ),
      };
    } else {
      return new ScheduleAppointmentResult(
        prev.meta,
        prev.appointments.map(a => (a.id === appointment.id ? appointment : a))
      );
    }
  });
};
