import { TaskIndicator } from './TaskIndicator';

export const TaskIndicatorColor: Record<TaskIndicator, string> = {
  [TaskIndicator.TODAY]: 'var(--primary-statuses-green-520)',
  [TaskIndicator.OVERDUE]: '#F56C6C',
  [TaskIndicator.UPCOMING]: '#AAB7D4',
  [TaskIndicator.EMPTY]: '#FCD044',
};
