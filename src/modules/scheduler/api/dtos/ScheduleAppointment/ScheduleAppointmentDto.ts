import type { OrderDto } from '@/modules/products';
import type { Nullable, UserRights } from '@/shared';
import type { ScheduleAppointmentStatus } from '../../../shared';
import type { ScheduleAppointmentEntityInfoDto } from './ScheduleAppointmentEntityInfoDto';

export interface ScheduleAppointmentDto {
  id: number;
  scheduleId: number;
  startDate: string;
  endDate: string;
  ownerId?: Nullable<number>;
  status: ScheduleAppointmentStatus;
  comment: Nullable<string>;
  entityId: Nullable<number>;
  orderId: Nullable<number>;
  performerId: number;
  createdAt: string;
  entityInfo?: ScheduleAppointmentEntityInfoDto;
  title: Nullable<string>;
  userRights: UserRights;
  prevAppointmentCount?: Nullable<number>;
  order?: Nullable<OrderDto>;
}
