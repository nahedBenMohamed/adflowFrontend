import { routes } from '@/app';
import type { TimelineRouteGenerator } from '../types';

interface BaseRoute {
  baseRoute: 'tasks' | 'projects' | 'project_tasks';
}

interface TasksParams extends BaseRoute {
  baseRoute: 'tasks';
  boardId: number;
}

interface ProjectsTasksParams extends BaseRoute {
  baseRoute: 'project_tasks';
  entityTypeId: number;
  entityId: number;
  from?: string;
}

interface ProjectsParams extends BaseRoute {
  baseRoute: 'projects';
  entityTypeId: number;
  boardId: number;
}

type RouteParams = TasksParams | ProjectsParams | ProjectsTasksParams;

export const generateTimelineRoute = ({
  baseRoute,
  ...params
}: RouteParams): TimelineRouteGenerator => {
  if (baseRoute === 'tasks') {
    const { boardId } = params as TasksParams;

    return ({ view }) => routes.tasksTimeline({ boardId, view });
  } else if (baseRoute === 'project_tasks') {
    const { entityTypeId, entityId, from } = params as ProjectsTasksParams;

    return ({ view }) => routes.projectTasksTimeline({ entityTypeId, entityId, view, from });
  } else if (baseRoute === 'projects') {
    const { entityTypeId, boardId } = params as ProjectsParams;

    return ({ view }) => routes.entitiesSectionTimeline({ entityTypeId, boardId, view });
  }

  throw new Error(
    'Cannot construct route generator for timeline. Either baseRoute or one of the required parameters  was not' +
      ' specified'
  );
};
