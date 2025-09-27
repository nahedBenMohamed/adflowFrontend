import { UtcDate, type EntityInfo, type Nullable } from '@/shared';
import type { VoximplantCallDto } from '../../../../api';
import { CallDirection } from '../CallDirection';
import type { CallStatus } from '../CallStatus';

export class VoximplantCall {
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
  createdAt: UtcDate;
  entityInfo?: EntityInfo;

  constructor({
    id,
    sessionId,
    callId,
    userId,
    entityId,
    direction,
    phoneNumber,
    duration,
    status,
    failureReason,
    recordUrl,
    createdAt,
    entityInfo,
  }: {
    id: number;
    sessionId: string;
    callId: string;
    userId: number;
    entityId: Nullable<number>;
    direction: CallDirection;
    phoneNumber: string;
    duration: Nullable<number>;
    status: Nullable<CallStatus>;
    failureReason: Nullable<string>;
    recordUrl: Nullable<string>;
    createdAt: UtcDate;
    entityInfo?: EntityInfo;
  }) {
    this.id = id;
    this.sessionId = sessionId;
    this.callId = callId;
    this.userId = userId;
    this.entityId = entityId;
    this.direction = direction;
    this.phoneNumber = phoneNumber;
    this.duration = duration;
    this.status = status;
    this.failureReason = failureReason;
    this.recordUrl = recordUrl;
    this.createdAt = createdAt;
    this.entityInfo = entityInfo;
  }

  static fromDto(dto: VoximplantCallDto): VoximplantCall {
    return new VoximplantCall({
      id: dto.id,
      callId: dto.callId,
      userId: dto.userId,
      status: dto.status,
      entityId: dto.entityId,
      duration: dto.duration,
      sessionId: dto.sessionId,
      direction: dto.direction,
      recordUrl: dto.recordUrl,
      entityInfo: dto.entityInfo,
      phoneNumber: dto.phoneNumber,
      failureReason: dto.failureReason,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: VoximplantCallDto[]): VoximplantCall[] {
    return dtos.map(this.fromDto);
  }

  isIncoming = (): boolean => {
    return this.direction === CallDirection.INCOMING;
  };
}
