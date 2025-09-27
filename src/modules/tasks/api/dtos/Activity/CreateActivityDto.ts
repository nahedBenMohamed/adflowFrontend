import type { CreateBaseTaskDto } from '../BaseTask/CreateBaseTaskDto';

export interface CreateActivityDto extends CreateBaseTaskDto {
  activityTypeId: number;
  entityId: number;
}
