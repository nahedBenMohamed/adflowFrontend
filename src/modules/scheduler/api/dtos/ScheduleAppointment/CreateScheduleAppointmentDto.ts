import type { Nullable } from '@/shared';
import type { ScheduleAppointmentStatus } from '../../../shared';

export class CreateScheduleAppointmentDto {
  scheduleId: number;
  startDate: string;
  endDate: string;
  ownerId?: Nullable<number>;
  status: ScheduleAppointmentStatus;
  comment: Nullable<string>;
  entityId: Nullable<number>;
  performerId: number;
  orderId: Nullable<number>;
  title: Nullable<string>;
  checkIntersection: boolean;

  constructor({
    scheduleId,
    startDate,
    endDate,
    ownerId,
    status,
    comment,
    entityId,
    performerId,
    orderId,
    title,
    checkIntersection,
  }: {
    scheduleId: number;
    startDate: string;
    endDate: string;
    ownerId?: Nullable<number>;
    status: ScheduleAppointmentStatus;
    comment: Nullable<string>;
    entityId: Nullable<number>;
    performerId: number;
    orderId: Nullable<number>;
    title: Nullable<string>;
    checkIntersection: boolean;
  }) {
    this.scheduleId = scheduleId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.ownerId = ownerId;
    this.comment = comment;
    this.entityId = entityId;
    this.performerId = performerId;
    this.orderId = orderId;
    this.title = title;
    this.checkIntersection = checkIntersection;
  }
}
