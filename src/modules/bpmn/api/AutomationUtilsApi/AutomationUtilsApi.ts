import { baseApi } from '@/app';
import type { AutomationEntityCondition } from '../../shared';
import { BpmnAutomationsApiRoutes } from '../BpmnAutomationsApiRoutes';

class AutomationUtilsApi {
  getDelay = async (seconds: number): Promise<string> => {
    const response = await baseApi.get(BpmnAutomationsApiRoutes.GET_DELAY, {
      params: { seconds },
    });

    return response.data;
  };

  generateFeelForAutomationEntityCondition = async (
    automationEntityCondition: AutomationEntityCondition
  ): Promise<string> => {
    const response = await baseApi.post(
      BpmnAutomationsApiRoutes.GENERATE_FEEL_FOR_AUTOMATION_ENTITY_CONDITION,
      automationEntityCondition
    );

    return response.data;
  };
}

export const automationUtilsApi = new AutomationUtilsApi();
