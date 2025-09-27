import { Order } from '@/modules/products';
import { UtcDate, type Nullable, type UserRights } from '@/shared';
import type { ScheduleAppointmentDto } from '../../../../api';
import { ScheduleAppointmentEntityInfo } from './ScheduleAppointmentEntityInfo';
import type { ScheduleAppointmentStatus } from './ScheduleAppointmentStatus';

export class ScheduleAppointment {
  id: number;
  scheduleId: number;
  startDate: UtcDate;
  endDate: UtcDate;
  ownerId?: Nullable<number>;
  status: ScheduleAppointmentStatus;
  comment: Nullable<string>;
  entityId: Nullable<number>;
  orderId: Nullable<number>;
  entityInfo?: ScheduleAppointmentEntityInfo;
  performerId: number;
  createdAt: UtcDate;
  title: Nullable<string>;
  userRights: UserRights;
  order?: Nullable<Order>;
  prevAppointmentCount?: Nullable<number>;

  constructor({
    id,
    scheduleId,
    startDate,
    endDate,
    ownerId,
    status,
    comment,
    entityId,
    orderId,
    performerId,
    createdAt,
    entityInfo,
    title,
    userRights,
    order,
    prevAppointmentCount,
  }: ScheduleAppointment) {
    this.id = id;
    this.scheduleId = scheduleId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.ownerId = ownerId;
    this.status = status;
    this.comment = comment;
    this.entityId = entityId;
    this.orderId = orderId;
    this.performerId = performerId;
    this.createdAt = createdAt;
    this.entityInfo = entityInfo;
    this.title = title;
    this.userRights = userRights;
    this.order = order;
    this.prevAppointmentCount = prevAppointmentCount;
  }

  static fromDto(dto: ScheduleAppointmentDto): ScheduleAppointment {
    return new ScheduleAppointment({
      id: dto.id,
      title: dto.title,
      status: dto.status,
      comment: dto.comment,
      orderId: dto.orderId,
      ownerId: dto.ownerId,
      entityId: dto.entityId,
      scheduleId: dto.scheduleId,
      userRights: dto.userRights,
      performerId: dto.performerId,
      endDate: UtcDate.parseISO(dto.endDate),
      startDate: UtcDate.parseISO(dto.startDate),
      createdAt: UtcDate.parseISO(dto.createdAt),
      prevAppointmentCount: dto.prevAppointmentCount,
      order: dto.order ? Order.fromDto(dto.order) : null,
      entityInfo: dto.entityInfo
        ? ScheduleAppointmentEntityInfo.fromDto(dto.entityInfo)
        : undefined,
    });
  }

  static fromDtos(dtos: ScheduleAppointmentDto[]): ScheduleAppointment[] {
    return dtos.map(this.fromDto);
  }
}
