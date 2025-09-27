import type { TaskIndicator } from '@/modules/section';
import type { Nullable, UserRights } from '@/shared';

export class CommonEntityCardDto {
  id: number;
  entityTypeId: number;
  stageId: number;
  name: string;
  userId: number;
  createdAt: string;
  linkedEntityNames: string[];
  taskIndicatorColor: TaskIndicator;
  userRights: UserRights;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
}
