import type { FileLinkDto } from '@/app';
import type { EntityInfo, Nullable, Optional } from '@/shared';
import type { UserRights } from '../../../../../shared';
import type { TaskView } from '../../../shared';

export abstract class BaseTaskDto {
  id: number;
  responsibleUserId: number;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  text: string;
  isResolved: boolean;
  resolvedDate: Nullable<string>;
  createdBy: number;
  createdAt: string;
  view: TaskView;
  fileLinks: FileLinkDto[];
  subtaskCount: number;
  entityInfo: Nullable<EntityInfo>;
  userRights: UserRights;
  weight: number;
  dependency: Optional<number>;
}
