import type { Nullable, UserRights } from '@/shared';
import type { TasksCount } from '../../shared';

export class ProjectEntityCardDto {
  id: number;
  entityTypeId: number;
  name: string;
  ownerId: number;
  participantIds: number[];
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  tasksCount: TasksCount;
  userRights: UserRights;
  createdAt: string;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
}
