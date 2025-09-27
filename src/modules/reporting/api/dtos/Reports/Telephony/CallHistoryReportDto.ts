import type { PagingMeta } from '@/shared';
import type { CallHistoryReportItemDto } from './CallHistoryReportItemDto';

export interface CallHistoryReportDto {
  calls: CallHistoryReportItemDto[];
  meta: PagingMeta;
}
