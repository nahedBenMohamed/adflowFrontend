import type { Nullable } from '@/shared';
import type { CallReportBlockDto } from '../General/CallReportBlockDto';

export interface TelephonyReportRowDto {
  ownerId: number;
  call: Nullable<CallReportBlockDto>;
}
