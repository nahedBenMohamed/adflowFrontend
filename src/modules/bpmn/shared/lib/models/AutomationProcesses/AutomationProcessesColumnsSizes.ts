import { AutomationProcessesColumnsIds } from './AutomationProcessesColumnsIds';

type ExcludedAutomationProcessesColumnsIds = Exclude<
  AutomationProcessesColumnsIds,
  AutomationProcessesColumnsIds.NAME
>;

export const AutomationProcessesColumnsSizes: Record<
  ExcludedAutomationProcessesColumnsIds,
  number
> = {
  [AutomationProcessesColumnsIds.DELETE]: 32,
  [AutomationProcessesColumnsIds.ACTIVE]: 140,
  [AutomationProcessesColumnsIds.CREATED_BY]: 256,
} as const;
