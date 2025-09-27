import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BPMN_AUTOMATIONS_QUERY_KEYS } from '../../BpmnAutomationsQueryKeys';
import { automationsProcessesApi } from '../AutomationsProcessesApi';

export const useDeleteAutomationProcess = (processId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => automationsProcessesApi.deleteAutomationProcess(processId),
    onSuccess: async (deletedProcessId: number): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
      });

      queryClient.removeQueries({
        queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcess(deletedProcessId),
      });

      queryClient.invalidateQueries({
        queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
      });
    },
  });
};
