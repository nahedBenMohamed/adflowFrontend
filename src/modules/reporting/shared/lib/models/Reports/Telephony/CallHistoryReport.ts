import type { PagingMeta } from '@/shared';
import type { CallHistoryReportDto } from '../../../../../api';
import { CallHistoryReportItem } from './CallHistoryReportItem';

export class CallHistoryReport {
  calls: CallHistoryReportItem[];
  meta: PagingMeta;

  constructor({ calls, meta }: CallHistoryReport) {
    this.calls = calls;
    this.meta = meta;
  }

  static fromDto(dto: CallHistoryReportDto): CallHistoryReport {
    return new CallHistoryReport({
      calls: CallHistoryReportItem.fromDtos(dto.calls),
      meta: dto.meta,
    });
  }
}
