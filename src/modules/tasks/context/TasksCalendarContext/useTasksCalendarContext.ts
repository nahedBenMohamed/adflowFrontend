import type { Nullable } from '@/shared';
import { useContext } from 'react';
import { TasksCalendarContext, type TasksCalendarContextValue } from './TasksCalendarContext';

export const useTasksCalendarContext = (): Nullable<TasksCalendarContextValue> =>
  useContext(TasksCalendarContext);
