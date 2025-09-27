import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BPMN_AUTOMATIONS_QUERY_KEYS } from '../../BpmnAutomationsQueryKeys';
import type { CreateAutomationProcessDto } from '../../dtos';
import { automationsProcessesApi } from '../AutomationsProcessesApi';

export const useCreateAutomationProcess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateAutomationProcessDto) =>
      automationsProcessesApi.createAutomationProcess(dto),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
      });

      queryClient.invalidateQueries({
        queryKey: BPMN_AUTOMATIONS_QUERY_KEYS.automationProcesses(),
      });
    },
  });
};
