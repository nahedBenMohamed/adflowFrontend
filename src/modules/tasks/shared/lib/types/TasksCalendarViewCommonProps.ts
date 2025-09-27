import type {
  TaskBoardFilter,
  TaskBoardFilterDto,
  TaskCalendarRouteGenerator,
  TaskSettingsIdentifier,
} from '@/modules/tasks';
import type { CalendarView, Nullable, UtcDateValue } from '@/shared';

export interface TasksCalendarViewCommonProps {
  startDate: UtcDateValue;
  isInitialFilterSet: boolean;
  filterDto: TaskBoardFilterDto;
  identifier: TaskSettingsIdentifier;
  boardId?: number;
  entityId?: Nullable<number>;
  calendarView?: CalendarView;
  routeGenerator: TaskCalendarRouteGenerator;
  setFilter: (filter: TaskBoardFilter) => void;
}
