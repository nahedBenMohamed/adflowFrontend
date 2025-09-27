import { SettingsStore } from '@/app';
import { serverEventService, type SubscriberStore } from '@/shared';
import { makeAutoObservable, toJS } from 'mobx';
import type { CSSProperties } from 'react';
import { toast, type ToastOptions } from 'react-toastify';
import type { ChatMessageCreatedEvent } from '../../multichat';
import type { NotificationDto } from '../api';
import {
  ChatNotificationBlock,
  NOTIFICATIONS_SETTINGS_LS_KEY,
  Notification,
  NotificationBlock,
  type NotificationLocalSettings,
} from '../shared';
import { TOAST_CLASS_NAME } from '../shared/lib/models/ToastClassName';
import { notificationsStore } from './NotificationsStore';

const toastStyles: CSSProperties = {
  width: 'var(--toast-width)',
  padding: 0,
  margin: '0 0 8px',
  background: 'none',
  borderRadius: 'var(--border-radius-block)',
  boxShadow:
    '0px 101px 40px rgba(146, 151, 176, 0.01), 0px 57px 34px rgba(146, 151, 176, 0.05), 0px 25px 25px rgba(146, 151, 176, 0.09), 0px 6px 14px rgba(146, 151, 176, 0.1), 0px 0px 0px rgba(146, 151, 176, 0.1)',
};

const toastBodyStyles: CSSProperties = {
  width: 'var(--toast-width)',
  background: 'none',
  padding: 0,
};

const SOUND_PUBLIC_PATH = '/sounds/notification.mp3';

class ToastNotificationsStore implements SubscriberStore {
  private _notificationSound = new Audio(SOUND_PUBLIC_PATH);
  private _isSoundUnlocked = false;

  isDrawerOpened = false;

  private unlockSound = () => {
    this._notificationSound
      .play()
      .then(() => {
        this._notificationSound.pause();
        this._notificationSound.currentTime = 0;

        this._isSoundUnlocked = true;
      })
      .catch(e => {
        console.error('Failed to unlock notifications sound:', e);
      });
  };

  playSound = (): void => {
    const { settings } = SettingsStore.getSettingsStore<NotificationLocalSettings>(
      NOTIFICATIONS_SETTINGS_LS_KEY
    );

    if (!settings.muteSound && this._isSoundUnlocked) this._notificationSound.play();
  };

  private _toastOptions: ToastOptions = {
    autoClose: 7000,
    closeButton: false,
    style: toastStyles,
    closeOnClick: false,
    hideProgressBar: true,
    bodyStyle: toastBodyStyles,
    className: TOAST_CLASS_NAME,
    onOpen: this.playSound,
  };

  constructor() {
    // "Unlock" sound after a user gesture (workaround to browsers autoplay restrictions)
    document.addEventListener('click', this.unlockSound, { once: true });

    makeAutoObservable(this);
  }

  setDrawerOpened = (isDrawerOpened: boolean): void => {
    this.isDrawerOpened = isDrawerOpened;
  };

  subscribe = async (): Promise<void> => {
    serverEventService.on<NotificationDto>(
      'notification:new',
      async (...args: NotificationDto[]): Promise<void> => {
        const notifications = Notification.fromDtos(args);

        this.showNotifications(notifications);
      }
    );

    serverEventService.on<number>(
      'notification:unseen',
      async (...args: number[]): Promise<void> => {
        if (args[0]) notificationsStore.setUnseenCount(args[0]);
      }
    );
  };

  unsubscribe = async (): Promise<void> => {
    serverEventService.off('notification:new');
    serverEventService.off('notification:unseen');
  };

  showNotifications = async (notifications: Notification[]): Promise<void> => {
    if (this.isDrawerOpened) return;

    notifications.forEach(n => {
      toast(<NotificationBlock key={n.id} notification={n} />, toJS(this._toastOptions));
    });
  };

  showChatMessages = async (messages: ChatMessageCreatedEvent[]): Promise<void> => {
    if (this.isDrawerOpened) return;

    messages.forEach(m => {
      toast(<ChatNotificationBlock key={m.messageId} message={m} />, toJS(this._toastOptions));
    });
  };

  dismissAllNotifications = (): void => {
    toast.dismiss();
    toast.clearWaitingQueue();
  };
}

export const toastNotificationsStore = new ToastNotificationsStore();
