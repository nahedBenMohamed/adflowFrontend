import type { Nullable } from '@/shared';
import type { ScheduleReportType } from '../../../../shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';

export class ScheduleReportFilterDto {
  type: ScheduleReportType;
  scheduleId: number;
  boardIds?: Nullable<number[]>;
  userIds?: Nullable<number[]>;
  period?: Nullable<DatePeriodFilter>;

  constructor({ type, scheduleId, userIds, boardIds, period }: ScheduleReportFilterDto) {
    this.type = type;
    this.scheduleId = scheduleId;
    this.userIds = userIds;
    this.boardIds = boardIds;
    this.period = period;
  }
}
