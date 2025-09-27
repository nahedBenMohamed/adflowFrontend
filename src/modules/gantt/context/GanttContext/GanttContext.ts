import type { BaseTask, CreateTaskDto } from '@/modules/tasks';
import type { Nullable } from '@/shared';
import { createContext, type CSSProperties, type ReactNode } from 'react';
import type { Bar, GanttRecord, TimelineRouteGenerator } from '../../shared';
import type { GanttStore } from '../../store';

interface TasksProps {
  addTask: (dto: CreateTaskDto) => Promise<void>;
  toggleResolveTask: (baseTask: BaseTask) => void;
}

export interface GanttContextValue {
  store: GanttStore;
  barHeight: number;
  tableIndent: number;
  canLoadMore: boolean;
  isLoadingMore: boolean;
  tasksProps?: TasksProps;
  entityId: Nullable<number>;
  entityTypeId: Nullable<number>;
  scrollTop: boolean | CSSProperties;
  loadMore: () => void;
  routeGenerator: TimelineRouteGenerator;
  onBarClick?: (record: GanttRecord) => void;
  onRowClick?: (record: GanttRecord) => void;
  onExpand?: (record: GanttRecord, collapsed: boolean) => void;
  updateRecordTitle: ({ id, title }: { id: number; title: string }) => Promise<void>;
  updateResponsibleUser: ({ id, userId }: { id: number; userId: number }) => Promise<void>;
  renderGroupBar?: (
    barInfo: Bar,
    { width, height }: { width: number; height: number }
  ) => ReactNode;
}

const GanttContext = createContext<Nullable<GanttContextValue>>(null);

export { GanttContext };
