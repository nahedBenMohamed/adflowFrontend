import type { PagingMeta } from '@/shared';
import type { ScheduleAppointmentDto } from './ScheduleAppointmentDto';

export interface ScheduleAppointmentResultDto {
  meta: PagingMeta;
  appointments: ScheduleAppointmentDto[];
}
