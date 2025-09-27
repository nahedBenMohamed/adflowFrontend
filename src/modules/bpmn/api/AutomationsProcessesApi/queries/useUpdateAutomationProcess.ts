import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AutomationProcess } from '../../../shared';
import { BPMN_AUTOMATIONS_QUERY_KEYS } from '../../BpmnAutomationsQueryKeys';
import type { UpdateAutomationProcessDto } from '../../dtos';
import { automationsProcessesApi } from '../AutomationsProcessesApi';

export const useUpdateAutomationProcess = (processId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateAutomationProcessDto) =>
      automationsProcessesApi.updateAutomationProcess({ processId, dto }),
    onSuccess: async (updatedProcess: AutomationProcess): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
        }),
        queryClient.cancelQueries({
          queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcess(processId),
        }),
      ]);

      queryClient.setQueryData<AutomationProcess>(
        BPMN_AUTOMATIONS_QUERY_KEYS.automationProcess(processId),
        updatedProcess
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
        }),
        queryClient.invalidateQueries({
          queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcess(processId),
        }),
      ]);
    },
  });
};
