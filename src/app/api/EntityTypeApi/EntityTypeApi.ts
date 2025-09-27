import { type EtSectionBuilderModel } from '@/modules/builder';
import { Field, FieldGroup, type ProjectFieldsSettings } from '@/modules/fields';
import { EntityType, UrlTemplateUtil } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import { type UpdateEntityTypeDto } from '../dtos/EntityType/UpdateEntityTypeDto';
import { type UpdateEntityTypeFieldsModel } from '../dtos/EntityType/UpdateEntityTypeFieldsModel';

class EntityTypeApi {
  getEntityTypes = async (): Promise<EntityType[]> => {
    const response = await baseApi.get(ApiRoutes.GET_ENTITY_TYPES);

    return EntityType.fromDtos(response.data);
  };

  getEntityType = async (id: number): Promise<EntityType> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(ApiRoutes.GET_ENTITY_TYPE, { id }));

    return EntityType.fromDto(response.data);
  };

  createEntityType = async (data: EtSectionBuilderModel): Promise<EntityType> => {
    const response = await baseApi.post(ApiRoutes.ADD_ENTITY_TYPE, data);

    return EntityType.fromDto(response.data);
  };

  deleteEntityType = async (id: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_ENTITY_TYPE, { id }));
  };

  updateEntityType = async (dto: UpdateEntityTypeDto): Promise<EntityType> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_ENTITY_TYPE, { id: dto.id }),
      dto
    );

    return EntityType.fromDto(response.data);
  };

  updateEntityTypeFields = async (model: UpdateEntityTypeFieldsModel): Promise<EntityType> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_ENTITY_TYPE_FIELDS, { id: model.entityTypeId }),
      {
        fieldGroups: FieldGroup.toDtos(model.fieldGroups),
        fields: Field.toDtos(model.fields),
      }
    );

    return EntityType.fromDto(response.data);
  };

  updateFieldsSettings = async ({
    entityTypeId,
    fieldsSettings,
  }: {
    entityTypeId: number;
    fieldsSettings: ProjectFieldsSettings;
  }): Promise<void> => {
    await baseApi.put(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_FIELDS_SETTINGS, { entityTypeId }),
      fieldsSettings
    );
  };
}

export const entityTypeApi = new EntityTypeApi();
