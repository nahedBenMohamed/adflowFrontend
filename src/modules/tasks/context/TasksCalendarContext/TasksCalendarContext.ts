import type { Nullable } from '@/shared';
import { createContext } from 'react';
import type { BaseTask } from '../../shared';

export interface TasksCalendarContextValue {
  onResolve: (task: BaseTask) => void;
}

export const TasksCalendarContext = createContext<Nullable<TasksCalendarContextValue>>(null);
