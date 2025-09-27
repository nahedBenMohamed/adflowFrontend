import type { ProjectReportItem, ProjectStageItem } from '../../../../shared';

export interface ProjectTaskUserReportRowDto {
  userId: number;
  opened: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  stages: ProjectStageItem[];
  planedTime: number;
  completionPercent: number;
}
