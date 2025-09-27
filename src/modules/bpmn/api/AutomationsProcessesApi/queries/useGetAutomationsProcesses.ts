import { useQuery } from '@tanstack/react-query';
import { BPMN_AUTOMATIONS_QUERY_KEYS } from '../../BpmnAutomationsQueryKeys';
import {
  automationsProcessesApi,
  type AutomationsProcessesQueryParams,
} from '../AutomationsProcessesApi';

export const useGetAutomationsProcesses = (params?: AutomationsProcessesQueryParams) =>
  useQuery({
    queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcessesWithParams(params),
    queryFn: () => automationsProcessesApi.getAutomationProcesses(params),
  });
