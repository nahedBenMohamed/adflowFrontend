import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { NotificationTypeSettingsDto } from '../../../../api';
import type { NotificationType } from './NotificationType';

export class NotificationTypeSettings {
  type: NotificationType;
  isEnabled: boolean;
  objectId: Nullable<number>;
  before: Nullable<number>;
  followUserIds: Nullable<number[]>;

  constructor(
    type: NotificationType,
    isEnabled: boolean,
    objectId: Nullable<number>,
    before: Nullable<number>,
    followUserIds: Nullable<number[]>
  ) {
    this.type = type;
    this.isEnabled = isEnabled;
    this.objectId = objectId;
    this.before = before;
    this.followUserIds = followUserIds;

    makeAutoObservable(this);
  }

  static fromDto(dto: NotificationTypeSettingsDto): NotificationTypeSettings {
    return new NotificationTypeSettings(
      dto.type,
      dto.isEnabled,
      dto.objectId,
      dto.before,
      dto.followUserIds
    );
  }

  static fromDtos(dtos: NotificationTypeSettingsDto[]): NotificationTypeSettings[] {
    return dtos.map(this.fromDto);
  }
}
