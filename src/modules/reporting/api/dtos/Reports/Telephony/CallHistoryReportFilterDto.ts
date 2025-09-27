import type { CallDirection, CallStatus } from '@/modules/telephony';
import type { Nullable } from '@/shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';
import type { CallDuration } from './CallDuration';

export class CallHistoryReportFilterDto {
  entityTypeId?: Nullable<number>;
  userIds?: Nullable<number[]>;
  direction?: Nullable<CallDirection>;
  period?: Nullable<DatePeriodFilter>;
  duration?: Nullable<CallDuration>;
  status?: CallStatus;

  constructor({
    entityTypeId,
    userIds,
    direction,
    period,
    duration,
    status,
  }: CallHistoryReportFilterDto) {
    this.entityTypeId = entityTypeId;
    this.userIds = userIds;
    this.direction = direction;
    this.period = period;
    this.duration = duration;
    this.status = status;
  }
}
