import { useQuery } from '@tanstack/react-query';
import { SCHEDULER_QUERY_KEYS } from '../../SchedulerQueryKeys';
import { scheduleAppointmentApi } from '../ScheduleAppointmentApi';

export const useGetScheduleAppointment = (appointmentId: number) =>
  useQuery({
    queryKey: SCHEDULER_QUERY_KEYS.scheduleAppointment(appointmentId),
    queryFn: () => scheduleAppointmentApi.getScheduleAppointment({ appointmentId }),
  });
