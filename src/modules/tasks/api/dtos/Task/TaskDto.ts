import type { Nullable } from '@/shared';
import type { Subtask } from '../../../shared';
import { BaseTaskDto } from '../BaseTask/BaseTaskDto';

export class TaskDto extends BaseTaskDto {
  title: string;
  plannedTime: Nullable<number>;
  boardId: Nullable<number>;
  stageId: Nullable<number>;
  settingsId: Nullable<number>;
  subtasks: Subtask[];
}
