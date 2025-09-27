import { PagingMeta, type Optional } from '@/shared';
import { queryClient } from '../../../../../index';
import {
  ScheduleAppointmentResult,
  ScheduleAppointmentStatus,
  type GetScheduleAppointmentsQueryParams,
  type ScheduleAppointment,
} from '../../../shared';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';

export const addScheduleAppointmentToCache = async ({
  appointment,
  queryParams,
}: {
  appointment: ScheduleAppointment;
  queryParams: GetScheduleAppointmentsQueryParams;
}): Promise<void> => {
  const resultFallback = new ScheduleAppointmentResult(new PagingMeta(0, 0), []);

  // TODO: do not update meta manually, invalidate instead (when separate endpoint will be created)
  const removeFromCache = (prev: Optional<ScheduleAppointmentResult>) =>
    prev
      ? new ScheduleAppointmentResult(
          { ...prev.meta, total: prev.meta.total - 1 },
          prev.appointments.filter(a => a.id !== appointment.id)
        )
      : resultFallback;

  await queryClient.cancelQueries({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
  });

  // we are not displaying cancelled appointments on a scheduler
  if (appointment.status === ScheduleAppointmentStatus.CANCELLED) {
    queryClient.setQueryData<ScheduleAppointmentResult>(
      SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
      removeFromCache
    );

    return;
  }

  // we are not displaying appointments with different title on a scheduler if such filter was applied
  if (queryParams.title && appointment.title && !queryParams.title.includes(appointment.title)) {
    queryClient.setQueryData<ScheduleAppointmentResult>(
      SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
      removeFromCache
    );

    return;
  }

  // TODO: do not update meta manually, invalidate instead (when separate endpoint will be created)
  queryClient.setQueryData<ScheduleAppointmentResult>(
    SCHEDULER_QUERY_KEYS.scheduleAppointments(queryParams),
    prev =>
      prev
        ? new ScheduleAppointmentResult({ ...prev.meta, total: prev.meta.total + 1 }, [
            ...prev.appointments,
            appointment,
          ])
        : resultFallback
  );
};
