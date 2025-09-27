import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { AutomationProcess, type AutomationProcessType } from '../../shared';
import { BpmnAutomationsApiRoutes } from '../BpmnAutomationsApiRoutes';
import type { CreateAutomationProcessDto, UpdateAutomationProcessDto } from '../dtos';

export interface AutomationsProcessesQueryParams {
  name?: string;
  objectId?: number;
  createdBy?: number;
  isReadonly?: boolean;
  type?: AutomationProcessType;
}

class AutomationsProcessesApi {
  getAutomationProcesses = async (
    params?: AutomationsProcessesQueryParams
  ): Promise<AutomationProcess[]> => {
    const response = await baseApi.get(BpmnAutomationsApiRoutes.GET_AUTOMATION_PROCESSES, {
      params,
    });

    return AutomationProcess.fromDtos(response.data);
  };

  getAutomationProcess = async (processId: number): Promise<AutomationProcess> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(BpmnAutomationsApiRoutes.GET_AUTOMATION_PROCESS, { processId })
    );

    return AutomationProcess.fromDto(response.data);
  };

  createAutomationProcess = async (dto: CreateAutomationProcessDto): Promise<AutomationProcess> => {
    const response = await baseApi.post(BpmnAutomationsApiRoutes.CREATE_AUTOMATION_PROCESS, dto);

    return AutomationProcess.fromDto(response.data);
  };

  updateAutomationProcess = async ({
    processId,
    dto,
  }: {
    processId: number;
    dto: UpdateAutomationProcessDto;
  }): Promise<AutomationProcess> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(
        UrlTemplateUtil.toPath(BpmnAutomationsApiRoutes.UPDATE_AUTOMATION_PROCESS, { processId }),
        dto
      ),
      dto
    );

    return AutomationProcess.fromDto(response.data);
  };

  deleteAutomationProcess = async (processId: number): Promise<number> => {
    const response = await baseApi.delete(
      UrlTemplateUtil.toPath(BpmnAutomationsApiRoutes.DELETE_AUTOMATION_PROCESS, { processId })
    );

    return response.data;
  };
}

export const automationsProcessesApi = new AutomationsProcessesApi();
