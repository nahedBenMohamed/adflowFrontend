import { TasksColumnsIds, TasksDefaultColumnsSizes } from '../models';

export const getTasksDefaultColumnSize = (columnId: string): number => {
  switch (columnId) {
    case TasksColumnsIds.TITLE:
      return TasksDefaultColumnsSizes[TasksColumnsIds.TITLE];

    case TasksColumnsIds.PLANNED_TIME:
      return TasksDefaultColumnsSizes[TasksColumnsIds.PLANNED_TIME];

    case TasksColumnsIds.ENTITY_INFO:
      return TasksDefaultColumnsSizes[TasksColumnsIds.ENTITY_INFO];

    default:
      return TasksDefaultColumnsSizes.default;
  }
};
