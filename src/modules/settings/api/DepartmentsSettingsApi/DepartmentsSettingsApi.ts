import { baseApi } from '@/app';
import { type Nullable, UrlTemplateUtil } from '@/shared';
import { Department, DepartmentSettings } from '../../shared';
import { SettingsApiRoutes } from '../SettingsApiRoutes';
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../dtos';

class DepartmentsSettingsApi {
  getGroups = async (): Promise<Department[]> => {
    const response = await baseApi.get(SettingsApiRoutes.GET_DEPARTMENTS);

    return Department.fromDtos(response.data);
  };

  getGroupSettings = async (id: number): Promise<DepartmentSettings> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(SettingsApiRoutes.GET_DEPARTMENTS_SETTINGS, { id })
    );

    return DepartmentSettings.fromDto(response.data);
  };

  addGroup = async (dto: CreateDepartmentDto): Promise<Department> => {
    const response = await baseApi.post(SettingsApiRoutes.ADD_DEPARTMENT, dto);

    return Department.fromDto(response.data);
  };

  updateGroup = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateDepartmentDto;
  }): Promise<Department> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(SettingsApiRoutes.UPDATE_DEPARTMENT, { id }),
      dto
    );

    return Department.fromDto(response.data);
  };

  deleteGroup = async ({
    id,
    newDepartmentId = null,
  }: {
    id: number;
    newDepartmentId?: Nullable<number>;
  }): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(SettingsApiRoutes.DELETE_DEPARTMENT, { id }), {
      params: { newDepartmentId },
    });
  };
}

export const departmentsSettingsApi = new DepartmentsSettingsApi();
