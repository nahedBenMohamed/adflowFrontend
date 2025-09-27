import type { Nullable } from '@/shared';
import type { CustomerReportType } from '../../../../shared';
import type { DatePeriodFilter } from '../../DatePeriodFilter';

export class CustomerReportFilterDto {
  entityTypeId: number;
  type: Nullable<CustomerReportType>;
  boardIds?: Nullable<number[]>;
  ownerIds?: Nullable<number[]>;
  period?: Nullable<DatePeriodFilter>;

  constructor({ type, entityTypeId, boardIds, ownerIds, period }: CustomerReportFilterDto) {
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.boardIds = boardIds;
    this.ownerIds = ownerIds;
    this.period = period;
  }
}
