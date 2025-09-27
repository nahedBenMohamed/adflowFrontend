import type { Nullable } from '@/shared';
import type { CreateBaseTaskDto } from '../BaseTask/CreateBaseTaskDto';
import type { CreateSubtaskDto } from './Subtask/CreateSubtaskDto';

export interface CreateTaskDto extends CreateBaseTaskDto {
  title: string;
  entityId: Nullable<number>;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  plannedTime: Nullable<number>;
  subtasks: CreateSubtaskDto[];
  settingsId: Nullable<number>;
}
