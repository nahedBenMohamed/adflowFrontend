import type { Nullable } from '@/shared';

export interface ProjectReportItem {
  taskCount: number;
  plannedTime: Nullable<number>;
}
