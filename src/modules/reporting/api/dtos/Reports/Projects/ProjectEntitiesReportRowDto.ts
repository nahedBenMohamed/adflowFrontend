import type { Nullable } from '@/shared';
import type { ProjectReportItem, ProjectStageItem } from '../../../../shared';
import type { ProjectReportFieldDto } from './ProjectReportFieldDto';

export interface ProjectEntitiesReportRowDto {
  entityId: number;
  entityName: string;
  all: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  projectStageId: Nullable<number>;
  stages: ProjectStageItem[];
  completionPercent: number;
  fields?: ProjectReportFieldDto[];
}
