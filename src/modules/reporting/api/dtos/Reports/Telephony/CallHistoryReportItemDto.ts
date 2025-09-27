import type { CallDirection, CallStatus } from '@/modules/telephony';
import type { EntityInfo } from '@/shared';

export interface CallHistoryReportItemDto {
  callId: string;
  userId: number;
  entityId: number;
  entityInfo: EntityInfo;
  direction: CallDirection;
  phoneNumber: string;
  status: CallStatus;
  duration: number;
  recordUrl: string;
  createdAt: string;
}
