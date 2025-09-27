import type { Nullable } from '@/shared';
import type { ComparativeReportType, ReportStageType } from '../../../../shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';

export class ComparativeReportFilterDto {
  type: ComparativeReportType;
  entityTypeId: number;
  userIds?: Nullable<number[]>;
  boardIds?: Nullable<number[]>;
  stageType?: Nullable<ReportStageType>;
  period?: Nullable<DatePeriodFilter>;
  ownerFieldId?: number;

  constructor({
    type,
    entityTypeId,
    userIds,
    boardIds,
    stageType,
    period,
    ownerFieldId,
  }: ComparativeReportFilterDto) {
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.userIds = userIds;
    this.boardIds = boardIds;
    this.stageType = stageType;
    this.period = period;
    this.ownerFieldId = ownerFieldId;
  }
}
