import type { Nullable } from '@/shared';
import { BaseTaskDto } from '../BaseTask/BaseTaskDto';

export class ActivityDto extends BaseTaskDto {
  activityTypeId: number;
  result: Nullable<string>;
}
