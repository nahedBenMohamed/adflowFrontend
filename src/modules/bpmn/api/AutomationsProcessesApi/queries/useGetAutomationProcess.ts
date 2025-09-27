import { useQuery } from '@tanstack/react-query';
import { BPMN_AUTOMATIONS_QUERY_KEYS } from '../../BpmnAutomationsQueryKeys';
import { automationsProcessesApi } from '../AutomationsProcessesApi';

export const useGetAutomationsProcess = (processId: number) =>
  useQuery({
    refetchOnWindowFocus: false,
    queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcess(processId),
    queryFn: () => automationsProcessesApi.getAutomationProcess(processId),
  });
