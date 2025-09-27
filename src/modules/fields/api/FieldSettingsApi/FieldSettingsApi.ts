import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { FieldSettings } from '../../shared';
import { FieldsApiRoutes } from '../FieldsApiRoutes';
import type { CheckFormulaDto, UpdateFieldSettingsDto } from '../dtos';

class FieldsSettingsApi {
  getFieldSettings = async (entityTypeId: number): Promise<FieldSettings[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(FieldsApiRoutes.GET_FIELD_SETTINGS, { entityTypeId })
    );

    return FieldSettings.fromDtos(response.data);
  };

  updateFieldSettings = async ({
    fieldId,
    entityTypeId,
    dto,
  }: {
    fieldId: number;
    entityTypeId: number;
    dto: UpdateFieldSettingsDto;
  }): Promise<FieldSettings> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(FieldsApiRoutes.UPDATE_FIELD_SETTINGS, { fieldId, entityTypeId }),
      dto
    );

    return FieldSettings.fromDto(response.data);
  };

  checkFieldFormula = async (dto: CheckFormulaDto): Promise<boolean> => {
    const response = await baseApi.post(FieldsApiRoutes.CHECK_FIELD_FORMULA, dto);

    return response.data;
  };
}

export const fieldsSettingsApi = new FieldsSettingsApi();
