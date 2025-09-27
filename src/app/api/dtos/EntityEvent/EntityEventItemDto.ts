import { type CallDirection, type CallStatus } from '@/modules/telephony';
import { type Nullable } from '@/shared';
import { type EntityInfoDto } from './EntityInfoDto';

export interface EntityEventItemDto {
  id: number;
  sessionId: string;
  callId: string;
  userId: number;
  entityId: number;
  direction: CallDirection;
  phoneNumber: string;
  duration: Nullable<number>;
  status: CallStatus;
  failureReason: Nullable<string>;
  recordUrl: Nullable<string>;
  createdAt: string;
  entityInfo: EntityInfoDto;
  comment?: string;
}
