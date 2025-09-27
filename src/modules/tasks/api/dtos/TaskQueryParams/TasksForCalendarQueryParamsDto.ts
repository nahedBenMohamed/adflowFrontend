import type { Nullable } from '@/shared';
import type { TaskBoardFilterDto } from '../TaskFilter/TaskBoardFilterDto';

export interface TasksForCalendarQueryParamsDto {
  boardId: Nullable<number>;
  filter: TaskBoardFilterDto;
  startDate?: string;
  endDate?: string;
}
