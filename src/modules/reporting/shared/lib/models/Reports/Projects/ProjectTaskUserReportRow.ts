import type { ProjectTaskUserReportRowDto } from '../../../../../api';
import type { ProjectReportItem } from './ProjectReportItem';
import type { ProjectStageItem } from './ProjectStageItem';

export class ProjectTaskUserReportRow {
  userId: number;
  opened: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  stages: ProjectStageItem[];
  planedTime: number;
  completionPercent: number;

  constructor({
    userId,
    opened,
    done,
    overdue,
    stages,
    planedTime,
    completionPercent,
  }: ProjectTaskUserReportRow) {
    this.userId = userId;
    this.opened = opened;
    this.done = done;
    this.overdue = overdue;
    this.stages = stages;
    this.planedTime = planedTime;
    this.completionPercent = completionPercent;
  }

  static fromDto(dto: ProjectTaskUserReportRowDto): ProjectTaskUserReportRow {
    return new ProjectTaskUserReportRow({
      userId: dto.userId,
      opened: dto.opened,
      done: dto.done,
      overdue: dto.overdue,
      stages: dto.stages,
      planedTime: dto.planedTime,
      completionPercent: dto.completionPercent,
    });
  }

  static fromDtos(dtos: ProjectTaskUserReportRowDto[]): ProjectTaskUserReportRow[] {
    return dtos.map(this.fromDto);
  }
}
