import type { NotificationTypeSettingsDto } from './NotificationTypeSettingsDto';

export class NotificationSettingsDto {
  enablePopup: boolean;
  types: NotificationTypeSettingsDto[];

  constructor(enablePopup: boolean, types: NotificationTypeSettingsDto[]) {
    this.enablePopup = enablePopup;
    this.types = types;
  }
}
