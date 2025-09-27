import type { CallDirection, CallStatus } from '@/modules/telephony';
import { UtcDate, type EntityInfo } from '@/shared';
import type { CallHistoryReportItemDto } from '../../../../../api';

export class CallHistoryReportItem {
  callId: string;
  userId: number;
  entityId: number;
  entityInfo: EntityInfo;
  direction: CallDirection;
  phoneNumber: string;
  status: CallStatus;
  duration: number;
  recordUrl: string;
  createdAt: UtcDate;

  constructor({
    callId,
    userId,
    entityId,
    entityInfo,
    direction,
    phoneNumber,
    status,
    duration,
    recordUrl,
    createdAt,
  }: CallHistoryReportItem) {
    this.callId = callId;
    this.userId = userId;
    this.entityId = entityId;
    this.entityInfo = entityInfo;
    this.direction = direction;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.duration = duration;
    this.recordUrl = recordUrl;
    this.createdAt = createdAt;
  }

  static fromDto(dto: CallHistoryReportItemDto): CallHistoryReportItem {
    return new CallHistoryReportItem({
      callId: dto.callId,
      userId: dto.userId,
      entityId: dto.entityId,
      entityInfo: dto.entityInfo,
      direction: dto.direction,
      phoneNumber: dto.phoneNumber,
      status: dto.status,
      duration: dto.duration,
      recordUrl: dto.recordUrl,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: CallHistoryReportItemDto[]): CallHistoryReportItem[] {
    return dtos.map(this.fromDto);
  }
}
