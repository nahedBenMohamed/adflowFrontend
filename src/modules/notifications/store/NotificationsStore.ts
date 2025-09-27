import { serverEventService, type DataStore, type SubscriberStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { notificationsApi, type NotificationDto, type NotificationsMeta } from '../api';
import { Notification } from '../shared';

class NotificationsStore implements DataStore, SubscriberStore {
  notifications: Notification[] = [];

  unseenCount = 0;
  meta: NotificationsMeta = {
    total: 0,
  };

  isLoaded = false;
  isLoading = false;
  isLoadingMore = false;

  constructor() {
    makeAutoObservable(this);
  }

  subscribe = async (): Promise<void> => {
    serverEventService.on<NotificationDto>(
      'notification:new',
      async (...args: NotificationDto[]): Promise<void> => {
        const notifications = Notification.fromDtos(args);

        this.addNewNotifications(notifications);
      }
    );
  };

  unsubscribe = async (): Promise<void> => {
    serverEventService.off('notification:new');
  };

  addNewNotifications = (newNotifications: Notification[]): void => {
    this.notifications = [...newNotifications, ...this.notifications];
  };

  loadData = async (): Promise<void> => {
    await this.loadUnseenCount();
  };

  loadUnseenCount = async (): Promise<void> => {
    this.unseenCount = await notificationsApi.getUnseenCount();
  };

  setUnseenCount = async (unseenCount: number): Promise<void> => {
    this.unseenCount = unseenCount;
  };

  loadNotifications = async (): Promise<void> => {
    try {
      this.isLoaded = false;
      this.isLoading = true;

      const { meta, notifications } = await notificationsApi.getNotifications();

      this.notifications = notifications;
      this.meta = meta;
    } catch (e) {
      throw new Error(`Error while loading notifications: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMoreNotifications = async (): Promise<void> => {
    try {
      if (this.notifications.length >= this.meta.total || this.isLoadingMore || this.isLoading)
        return;

      this.isLoadingMore = true;

      const { meta, notifications } = await notificationsApi.getNotifications(
        this.notifications.length
      );

      this.notifications.push(...notifications);
      this.meta = meta;
    } catch (e) {
      throw new Error(`Error while loading more notifications: ${e}`);
    } finally {
      this.isLoadingMore = false;
    }
  };

  markAllNotificationsAsSeen = async (): Promise<void> => {
    try {
      notificationsApi.markAllAsSeen();

      this.notifications.map(n => (n.isSeen = true));

      this.unseenCount = 0;
    } catch (e) {
      throw new Error(`Error while marking all notifications as seen: ${e}`);
    }
  };

  markNotificationAsSeen = async (id: number): Promise<void> => {
    try {
      notificationsApi.markAsSeen(id);

      const notification = this.notifications.find(n => n.id === id);

      if (!notification) {
        throw new Error(`Notification ${id} not found`);
      }

      notification.isSeen = true;

      if (this.unseenCount > 0) this.unseenCount--;
    } catch (e) {
      throw new Error(`Error while marking notification ${id} as seen: ${e}`);
    }
  };

  reset = (): void => {
    this.notifications = [];
    this.meta = {
      total: 0,
    };

    this.isLoading = false;
    this.isLoadingMore = false;
  };
}

export const notificationsStore = new NotificationsStore();
