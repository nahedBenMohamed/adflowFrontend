import { TasksColumnsIds } from './TasksColumnsIds';

type ExtractedDefaultTasksColumnsIds = Extract<
  TasksColumnsIds,
  TasksColumnsIds.TITLE | TasksColumnsIds.ENTITY_INFO | TasksColumnsIds.PLANNED_TIME
>;

export const TasksDefaultColumnsSizes: Record<ExtractedDefaultTasksColumnsIds | 'default', number> =
  {
    default: 240,
    [TasksColumnsIds.TITLE]: 480,
    [TasksColumnsIds.ENTITY_INFO]: 160,
    [TasksColumnsIds.PLANNED_TIME]: 144,
  };
