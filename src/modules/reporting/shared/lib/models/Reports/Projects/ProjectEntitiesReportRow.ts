import type { Nullable } from '@/shared';
import type { ProjectEntitiesReportRowDto } from '../../../../../api';
import { ProjectReportField } from './ProjectReportField';
import type { ProjectReportItem } from './ProjectReportItem';
import type { ProjectStageItem } from './ProjectStageItem';

export class ProjectEntitiesReportRow {
  entityId: number;
  entityName: string;
  all: ProjectReportItem;
  done: ProjectReportItem;
  overdue: ProjectReportItem;
  projectStageId: Nullable<number>;
  stages: ProjectStageItem[];
  completionPercent: number;
  fields: Nullable<ProjectReportField[]>;

  constructor({
    entityId,
    entityName,
    all,
    done,
    overdue,
    projectStageId,
    stages,
    completionPercent,
    fields,
  }: ProjectEntitiesReportRow) {
    this.entityId = entityId;
    this.entityName = entityName;
    this.all = all;
    this.done = done;
    this.overdue = overdue;
    this.projectStageId = projectStageId;
    this.stages = stages;
    this.completionPercent = completionPercent;
    this.fields = fields;
  }

  static fromDto(dto: ProjectEntitiesReportRowDto): ProjectEntitiesReportRow {
    return new ProjectEntitiesReportRow({
      entityId: dto.entityId,
      entityName: dto.entityName,
      all: dto.all,
      done: dto.done,
      overdue: dto.overdue,
      projectStageId: dto.projectStageId,
      stages: dto.stages,
      completionPercent: dto.completionPercent,
      fields: dto.fields ? ProjectReportField.fromDtos(dto.fields) : null,
    });
  }

  static fromDtos(dtos: ProjectEntitiesReportRowDto[]): ProjectEntitiesReportRow[] {
    return dtos.map(this.fromDto);
  }
}
