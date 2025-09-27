import type { EntityInfo, Nullable } from '@/shared';
import type { CallDirection, CallStatus } from '../../../shared';

export class VoximplantCallDto {
  id: number;
  sessionId: string;
  callId: string;
  userId: number;
  entityId: Nullable<number>;
  direction: CallDirection;
  phoneNumber: string;
  // in seconds
  duration: Nullable<number>;
  status: Nullable<CallStatus>;
  nullable: true;
  failureReason: Nullable<string>;
  recordUrl: Nullable<string>;
  createdAt: string;
  entityInfo?: EntityInfo;
}
