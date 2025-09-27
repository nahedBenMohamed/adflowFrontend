import type { Nullable } from '@/shared';
import type { ReportStageType, TelephonyReportType } from '../../../../shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';
import type { CallDuration } from './CallDuration';

export class TelephonyReportFilterDto {
  type: TelephonyReportType;
  entityTypeId?: Nullable<number>;
  userIds?: Nullable<number[]>;
  boardIds?: Nullable<number[]>;
  stageType?: Nullable<ReportStageType>;
  period?: Nullable<DatePeriodFilter>;
  duration?: Nullable<CallDuration>;

  constructor({
    type,
    entityTypeId,
    userIds,
    boardIds,
    stageType,
    period,
    duration,
  }: TelephonyReportFilterDto) {
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.userIds = userIds;
    this.boardIds = boardIds;
    this.stageType = stageType;
    this.period = period;
    this.duration = duration;
  }
}
