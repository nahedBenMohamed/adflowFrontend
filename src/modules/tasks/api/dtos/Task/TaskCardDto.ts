import type { Nullable } from '@/shared';
import type { BaseTaskDto } from '../BaseTask/BaseTaskDto';

export interface TaskCardDto extends BaseTaskDto {
  title: string;
  plannedTime: Nullable<number>;
  boardId: Nullable<number>;
  stageId: Nullable<number>;
  settingsId: Nullable<number>;
}
