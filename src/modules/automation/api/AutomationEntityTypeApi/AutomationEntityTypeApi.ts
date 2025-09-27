import { baseApi } from '@/app';
import { type Nullable, UrlTemplateUtil } from '@/shared';
import { AutomationEntityType } from '../../shared';
import { AutomationApiRoutes } from '../AutomationApiRoutes';
import type { CreateAutomationEntityTypeDto, UpdateAutomationEntityType } from '../dtos';

class AutomationEntityTypeApi {
  getEntityTypeAutomations = async ({
    entityTypeId,
    boardId,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
  }): Promise<AutomationEntityType[]> => {
    const response = await baseApi.get(AutomationApiRoutes.GET_ENTITY_TYPE_AUTOMATIONS, {
      params: {
        entityTypeId,
        boardId,
      },
    });

    return AutomationEntityType.fromDtos(response.data);
  };

  createEntityTypeAutomation = async (
    dto: CreateAutomationEntityTypeDto
  ): Promise<AutomationEntityType> => {
    const response = await baseApi.post(AutomationApiRoutes.CREATE_ENTITY_TYPE_AUTOMATION, dto);

    return AutomationEntityType.fromDto(response.data);
  };

  updateEntityTypeAutomation = async ({
    automationId,
    dto,
  }: {
    automationId: number;
    dto: UpdateAutomationEntityType;
  }): Promise<AutomationEntityType> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(AutomationApiRoutes.UPDATE_ENTITY_TYPE_AUTOMATION, { automationId }),
      dto
    );

    return AutomationEntityType.fromDto(response.data);
  };

  deleteEntityTypeAutomation = async (automationId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(AutomationApiRoutes.DELETE_ENTITY_TYPE_AUTOMATION, { automationId })
    );
  };
}

export const automationEntityTypeApi = new AutomationEntityTypeApi();
