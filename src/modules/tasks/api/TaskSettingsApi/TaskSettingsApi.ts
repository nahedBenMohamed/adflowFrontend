import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { TaskSettings } from '../../shared';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type { CreateTaskSettingsDto, UpdateTaskSettingsDto } from '../dtos';

class TaskSettingsApi {
  getTaskSettingsList = async (): Promise<TaskSettings[]> => {
    const response = await baseApi.get(TasksApiRoutes.GET_TASK_SETTINGS_LIST);

    return TaskSettings.fromDtos(response.data);
  };

  updateTaskSettings = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateTaskSettingsDto;
  }): Promise<TaskSettings> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(TasksApiRoutes.UPDATE_TASK_SETTINGS, { id }),
      dto
    );

    return TaskSettings.fromDto(response.data);
  };

  createTaskSettings = async (dto: CreateTaskSettingsDto): Promise<TaskSettings> => {
    const response = await baseApi.post(TasksApiRoutes.CREATE_TASK_SETTINGS, dto);

    return TaskSettings.fromDto(response.data);
  };
}

export const taskSettingsApi = new TaskSettingsApi();
