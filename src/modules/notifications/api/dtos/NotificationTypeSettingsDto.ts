import type { Nullable } from '@/shared';
import type { NotificationType } from '../../shared';

export class NotificationTypeSettingsDto {
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
  }
}
