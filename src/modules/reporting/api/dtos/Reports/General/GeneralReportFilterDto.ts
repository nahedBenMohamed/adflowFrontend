import type { Nullable } from '@/shared';
import type { GeneralReportType, ReportStageType } from '../../../../shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';
import type { GeneralReportFilterVisibilityDto } from './GeneralReportFilterVisibilityDto';

export class GeneralReportFilterDto {
  type: GeneralReportType;
  entityTypeId: number;
  userIds?: Nullable<number[]>;
  boardIds?: Nullable<number[]>;
  stageType?: Nullable<ReportStageType>;
  period?: Nullable<DatePeriodFilter>;
  visibility?: Nullable<GeneralReportFilterVisibilityDto>;
  ownerFieldId?: number;

  constructor({
    type,
    entityTypeId,
    userIds,
    boardIds,
    stageType,
    period,
    visibility,
    ownerFieldId,
  }: GeneralReportFilterDto) {
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.userIds = userIds;
    this.boardIds = boardIds;
    this.stageType = stageType;
    this.period = period;
    this.visibility = visibility;
    this.ownerFieldId = ownerFieldId;
  }
}
