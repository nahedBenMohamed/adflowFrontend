import type { TasksForCalendarQueryParamsDto } from './dtos';

const queryKeys = {
  tasks: ['tasks'],
  tasksCalendar() {
    return [...this.tasks, 'tasks_calendar'];
  },
  tasksForCalendar(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksCalendar(), 'tasks', queryParams];
  },
  tasksForCalendarCount(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksForCalendar(queryParams), 'count'];
  },
  activitiesForCalendar(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksCalendar(), 'activities', queryParams];
  },
  activitiesForCalendarCount(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.activitiesForCalendar(queryParams), 'count'];
  },
  timeBoardTasksForCalendar(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksCalendar(), 'time_board', queryParams];
  },
  timeBoardTasksForCalendarCount(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.timeBoardTasksForCalendar(queryParams), 'count'];
  },
  updateTaskInCalendar(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksCalendar(), 'update', queryParams];
  },
  updateActivityInCalendar(queryParams: TasksForCalendarQueryParamsDto) {
    return [...this.tasksCalendar(), 'update', 'activity', queryParams];
  },
} as const;

export const TASKS_QUERY_KEYS = Object.freeze(queryKeys);
