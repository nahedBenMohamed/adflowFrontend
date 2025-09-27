import type { Nullable } from '@/shared';
import type { SchedulePerformerDto } from '../../../../api';
import type { SchedulePerformerType } from './SchedulePerformerType';

export class SchedulePerformer {
  id: number;
  type: SchedulePerformerType;
  userId: Nullable<number>;
  departmentId: Nullable<number>;

  constructor({
    id,
    type,
    userId,
    departmentId,
  }: {
    id: number;
    type: SchedulePerformerType;
    userId: Nullable<number>;
    departmentId: Nullable<number>;
  }) {
    this.id = id;
    this.type = type;
    this.userId = userId;
    this.departmentId = departmentId;
  }

  static fromDto(dto: SchedulePerformerDto): SchedulePerformer {
    return new SchedulePerformer({
      id: dto.id,
      type: dto.type,
      userId: dto.userId,
      departmentId: dto.departmentId,
    });
  }

  static fromDtos(dtos: SchedulePerformerDto[]): SchedulePerformer[] {
    return dtos.map(this.fromDto);
  }
}
