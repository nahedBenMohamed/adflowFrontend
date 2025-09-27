import type { Nullable } from '@/shared';
import type { SchedulePerformerType } from '../../../shared';

export class UpdateSchedulePerformerDto {
  type: SchedulePerformerType;
  userId: Nullable<number>;
  departmentId: Nullable<number>;

  constructor({
    type,
    userId,
    departmentId,
  }: {
    type: SchedulePerformerType;
    userId: Nullable<number>;
    departmentId: Nullable<number>;
  }) {
    this.type = type;
    this.userId = userId;
    this.departmentId = departmentId;
  }
}
