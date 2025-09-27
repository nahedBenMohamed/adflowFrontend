import type { ProjectReportItem, ProjectStageItem } from '../../../../shared';

export interface ProjectTaskUserReportRowTotalDto {
  opened: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  stages: ProjectStageItem[];
  planedTime: number;
  completionPercent: number;
}
