import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { ActivityType } from '../../shared';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { CreateActivityTypeDto, UpdateActivityTypeDto } from '../dtos';

class ActivityTypeApi {
  getActivityTypes = async (): Promise<ActivityType[]> => {
    const response = await baseApi.get(TasksApiRoutes.GET_ACTIVITY_TYPES);

    return ActivityType.fromDtos(response.data);
  };

  addActivityType = async (dto: CreateActivityTypeDto): Promise<ActivityType> => {
    const response = await baseApi.post(TasksApiRoutes.ADD_ACTIVITY_TYPE, dto);

    return ActivityType.fromDto(response.data);
  };

  updateActivityType = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateActivityTypeDto;
  }): Promise<ActivityType> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TasksApiRoutes.UPDATE_ACTIVITY_TYPE, { id }),
      dto
    );

    return ActivityType.fromDto(response.data);
  };

  deleteActivityType = async (activityTypeId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TasksApiRoutes.DELETE_ACTIVITY_TYPE, { id: activityTypeId })
    );
  };
}

export const activityTypeApi = new ActivityTypeApi();
