import type { TaskBoardFilter } from './TaskFilter/TaskBoardFilter';

export interface TaskFilterDrawerAsyncStateProps {
  filterClearing: boolean;
  hasError: boolean;
  applyFilter: (filter: TaskBoardFilter) => void;
  clearFilter: () => void;
}
