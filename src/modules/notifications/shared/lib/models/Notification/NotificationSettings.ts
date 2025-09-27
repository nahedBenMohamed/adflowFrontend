import type { NotificationSettingsDto } from '../../../../api';
import { NotificationTypeSettings } from '../NotificationType/NotificationTypeSettings';

export class NotificationSettings {
  enablePopup: boolean;
  types: NotificationTypeSettings[];

  constructor(enablePopup: boolean, types: NotificationTypeSettings[]) {
    this.enablePopup = enablePopup;
    this.types = types;
  }

  static fromDto(dto: NotificationSettingsDto): NotificationSettings {
    return new NotificationSettings(dto.enablePopup, NotificationTypeSettings.fromDtos(dto.types));
  }
}
