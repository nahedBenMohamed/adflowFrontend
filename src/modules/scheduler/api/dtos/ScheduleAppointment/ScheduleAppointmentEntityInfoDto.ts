import type { Nullable } from '@/shared';

export interface ScheduleAppointmentEntityInfoDto {
  id: number;
  name: string;
  entityTypeId: number;
  ownerId: number;
  stageId: Nullable<number>;
  createdAt: string;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  participantIds: Nullable<number[]>;
  hasAccess: Nullable<boolean>;
}
