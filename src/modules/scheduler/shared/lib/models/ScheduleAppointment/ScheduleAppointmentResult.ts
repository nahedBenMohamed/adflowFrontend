import type { PagingMeta } from '@/shared';
import type { ScheduleAppointmentResultDto } from '../../../../api';
import { ScheduleAppointment } from './ScheduleAppointment';

export class ScheduleAppointmentResult {
  meta: PagingMeta;
  appointments: ScheduleAppointment[];

  constructor(meta: PagingMeta, appointments: ScheduleAppointment[]) {
    this.meta = meta;
    this.appointments = appointments;
  }

  static fromDto(dto: ScheduleAppointmentResultDto): ScheduleAppointmentResult {
    return new ScheduleAppointmentResult(dto.meta, ScheduleAppointment.fromDtos(dto.appointments));
  }
}
