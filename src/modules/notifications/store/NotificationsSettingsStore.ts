import { watchdogStore } from '@/app';
import type { DataStore, Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { notificationsSettingsApi } from '../api';
import type { NotificationSettings } from '../shared';

export class NotificationsSettingsStore implements DataStore {
  notificationSettings: Nullable<NotificationSettings> = null;

  isLoading = false;
  isUpdating = false;

  constructor() {
    watchdogStore.watch(this);
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    await this.loadNotificationSettings();
  };

  loadNotificationSettings = async (): Promise<NotificationSettings> => {
    try {
      this.isLoading = true;

      const notificationSettings = await notificationsSettingsApi.getNotificationsSettings();
      this.notificationSettings = notificationSettings;

      return notificationSettings;
    } catch (e) {
      throw new Error(`Error while loading notification settings: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  updateNotificationSettings = async (dto: NotificationSettings): Promise<void> => {
    try {
      this.isUpdating = true;

      const notificationSettings = await notificationsSettingsApi.updateNotificationsSettings(dto);
      this.notificationSettings = notificationSettings;
    } catch (e) {
      throw new Error(`Error while updating notification settings: ${e}`);
    } finally {
      this.isUpdating = false;
    }
  };

  reset = (): void => {
    this.notificationSettings = null;
  };
}
