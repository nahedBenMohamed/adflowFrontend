import { type Nullable, UtcDate } from '@/shared';
import type { ScheduleAppointmentEntityInfoDto } from '../../../../api';

export class ScheduleAppointmentEntityInfo {
  id: number;
  name: string;
  entityTypeId: number;
  ownerId: number;
  stageId: Nullable<number>;
  createdAt: UtcDate;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  participantIds: Nullable<number[]>;
  hasAccess: boolean;

  constructor({
    id,
    name,
    entityTypeId,
    ownerId,
    stageId,
    createdAt,
    copiedFrom,
    copiedCount,
    participantIds,
    hasAccess,
  }: {
    id: number;
    name: string;
    entityTypeId: number;
    ownerId: number;
    stageId: Nullable<number>;
    createdAt: UtcDate;
    copiedFrom: Nullable<number>;
    copiedCount: Nullable<number>;
    participantIds: Nullable<number[]>;
    hasAccess: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.entityTypeId = entityTypeId;
    this.ownerId = ownerId;
    this.stageId = stageId;
    this.createdAt = createdAt;
    this.copiedFrom = copiedFrom;
    this.copiedCount = copiedCount;
    this.participantIds = participantIds;
    this.hasAccess = hasAccess;
  }

  static fromDto(dto: ScheduleAppointmentEntityInfoDto): ScheduleAppointmentEntityInfo {
    return new ScheduleAppointmentEntityInfo({
      id: dto.id,
      name: dto.name,
      entityTypeId: dto.entityTypeId,
      ownerId: dto.ownerId,
      stageId: dto.stageId,
      createdAt: UtcDate.parseISO(dto.createdAt),
      copiedFrom: dto.copiedFrom,
      copiedCount: dto.copiedCount,
      participantIds: dto.participantIds,
      hasAccess: dto.hasAccess ?? false,
    });
  }
}
