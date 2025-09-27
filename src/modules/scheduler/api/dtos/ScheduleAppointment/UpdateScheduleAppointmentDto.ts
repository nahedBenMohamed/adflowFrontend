import type { Nullable } from '@/shared';
import type { ScheduleAppointment, ScheduleAppointmentStatus } from '../../../shared';

export class UpdateScheduleAppointmentDto {
  scheduleId?: number;
  startDate?: string;
  endDate?: string;
  ownerId?: Nullable<number>;
  status?: ScheduleAppointmentStatus;
  comment?: Nullable<string>;
  entityId?: Nullable<number>;
  performerId?: number;
  orderId?: Nullable<number>;
  title?: Nullable<string>;

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
  }: {
    scheduleId?: number;
    startDate?: string;
    endDate?: string;
    ownerId?: Nullable<number>;
    status?: ScheduleAppointmentStatus;
    comment?: Nullable<string>;
    entityId?: Nullable<number>;
    performerId?: number;
    orderId?: Nullable<number>;
    title?: Nullable<string>;
  }) {
    this.scheduleId = scheduleId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.ownerId = ownerId;
    this.status = status;
    this.comment = comment;
    this.entityId = entityId;
    this.performerId = performerId;
    this.orderId = orderId;
    this.title = title;
  }

  static fromModel(model: ScheduleAppointment): UpdateScheduleAppointmentDto {
    return new UpdateScheduleAppointmentDto({
      title: model.title,
      status: model.status,
      comment: model.comment,
      ownerId: model.ownerId,
      orderId: model.orderId,
      entityId: model.entityId,
      scheduleId: model.scheduleId,
      performerId: model.performerId,
      endDate: model.endDate.formatISO(),
      startDate: model.startDate.formatISO(),
    });
  }
}
