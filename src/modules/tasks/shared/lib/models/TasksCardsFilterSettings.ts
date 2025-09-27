import type { CalendarView, Nullable } from '@/shared';
import type { TaskColorType } from './TaskCalendar/TaskColorType';
import type { TaskBoardFilter } from './TaskFilter/TaskBoardFilter';
import type { TasksFilterType } from './TasksFilterType';

export interface TasksCardsFilterSettings {
  filterType: TasksFilterType;
  boardId: Nullable<number>;
  filter: TaskBoardFilter;
  justMyCards: boolean;
  saveFilterSettings: boolean;
  calendarView?: CalendarView;
  taskColorType?: TaskColorType;
}
