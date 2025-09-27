import { useMemo } from 'react';
import { type AutomationProcess, AutomationProcessRow } from '../models';

export const useAutomationProcessesData = (models: AutomationProcess[]): AutomationProcessRow[] =>
  useMemo<AutomationProcessRow[]>(() => models.map(AutomationProcessRow.fromModel), [models]);
