import { routes } from '@/app';
import type { TaskCalendarRouteGenerator } from '../types';

interface BaseRoute {
  baseRoute: 'tasks' | 'projects' | 'activities' | 'time_board';
}

interface TasksParams extends BaseRoute {
  baseRoute: 'tasks';
  boardId: number;
}

interface ProjectsParams extends BaseRoute {
  baseRoute: 'projects';
  entityTypeId: number;
  entityId: number;
  from?: string;
}

interface ActivitiesParams extends BaseRoute {
  baseRoute: 'activities';
}

interface TimeBoardParams extends BaseRoute {
  baseRoute: 'time_board';
}

type RouteParams = TasksParams | ProjectsParams | ActivitiesParams | TimeBoardParams;

export const generateTasksCalendarRoute = ({
  baseRoute,
  ...params
}: RouteParams): TaskCalendarRouteGenerator => {
  if (baseRoute === 'tasks') {
    const { boardId } = params as TasksParams;

    return ({ view, year, month, day }) =>
      routes.tasksCalendar({ boardId, view, year, month, day });
  } else if (baseRoute === 'projects') {
    const { entityTypeId, entityId, from } = params as ProjectsParams;

    return ({ view, year, month, day }) =>
      routes.projectTasksCalendar({ entityTypeId, entityId, view, year, month, day, from });
  } else if (baseRoute === 'activities') {
    return ({ view, year, month, day }) => routes.activitiesCalendar({ view, year, month, day });
  } else if (baseRoute === 'time_board') {
    return ({ view, year, month, day }) => routes.timeBoardCalendar({ view, year, month, day });
  }

  throw new Error(
    'Cannot construct route generator for tasks calendar. Either baseRoute or one of the required parameters  was not specified'
  );
};
