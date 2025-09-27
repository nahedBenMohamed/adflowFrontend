import type { ProjectTaskUserReportRowTotalDto } from '../../../../../api';
import type { ProjectReportItem } from './ProjectReportItem';
import type { ProjectStageItem } from './ProjectStageItem';

export class ProjectTaskUserReportTotalRow {
  opened: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  stages: ProjectStageItem[];
  planedTime: number;
  completionPercent: number;

  constructor({
    opened,
    done,
    overdue,
    stages,
    planedTime,
    completionPercent,
  }: ProjectTaskUserReportTotalRow) {
    this.opened = opened;
    this.done = done;
    this.overdue = overdue;
    this.stages = stages;
    this.planedTime = planedTime;
    this.completionPercent = completionPercent;
  }

  static fromDto(dto: ProjectTaskUserReportRowTotalDto): ProjectTaskUserReportTotalRow {
    return new ProjectTaskUserReportTotalRow({
      opened: dto.opened,
      done: dto.done,
      overdue: dto.overdue,
      stages: dto.stages,
      planedTime: dto.planedTime,
      completionPercent: dto.completionPercent,
    });
  }
}
