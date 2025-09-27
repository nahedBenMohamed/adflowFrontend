import { type EntityEventItemDto } from '@/app';
import { type CallDirection, type CallStatus } from '@/modules/telephony';
import { makeObservable } from 'mobx';
import { type Nullable } from '../../types';
import { UtcDate } from '../UtcDate';
import { type EntityInfo } from './EntityInfo';

export class CallInfo {
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
  createdAt: UtcDate;
  entityInfo: EntityInfo;
  comment?: string;

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
    comment,
  }: {
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
    createdAt: UtcDate;
    entityInfo: EntityInfo;
    comment?: string;
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
    this.comment = comment;

    makeObservable(this, {
      comment: true,
    });
  }

  static fromDto(dto: EntityEventItemDto): CallInfo {
    return new CallInfo({ ...dto, createdAt: UtcDate.parseISO(dto.createdAt) });
  }

  static fromDtos(dtos: EntityEventItemDto[]): CallInfo[] {
    return dtos.map(dto => CallInfo.fromDto(dto));
  }
}
