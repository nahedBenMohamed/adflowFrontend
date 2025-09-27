import type { MinMaxColumnSize } from '@/shared';
import { TasksColumnsIds } from './TasksColumnsIds';

type ExtractedTasksColumnsIds = Extract<
  TasksColumnsIds,
  TasksColumnsIds.CHECKBOX | TasksColumnsIds.DELETE
>;

export const TasksColumnsSizes: Record<ExtractedTasksColumnsIds | MinMaxColumnSize, number> = {
  [TasksColumnsIds.CHECKBOX]: 16,
  [TasksColumnsIds.DELETE]: 20,
  min: 160,
  max: 800,
} as const;
