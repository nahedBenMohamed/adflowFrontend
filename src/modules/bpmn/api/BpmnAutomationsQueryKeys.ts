import type { AutomationsProcessesQueryParams } from './AutomationsProcessesApi/AutomationsProcessesApi';

const queryKeys = {
  bpmn: ['bpmn'],
  automationProcesses() {
    return [...this.bpmn, 'automation-processes'];
  },
  automationProcessesWithParams(params?: AutomationsProcessesQueryParams) {
    return [...this.automationProcesses(), params];
  },
  automationProcess(processId: number) {
    return [...this.bpmn, 'automation-process', processId];
  },
} as const;

export const BPMN_AUTOMATIONS_QUERY_KEYS = Object.freeze(queryKeys);
