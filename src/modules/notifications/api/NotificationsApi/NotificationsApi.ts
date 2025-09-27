import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { Notification } from '../../shared';
import { NotificationsApiRoutes } from '../NotificationsApiRoutes';
import type { NotificationsMeta, NotificationsResult } from '../dtos';

const NOTIFICATIONS_LIMIT = 30;

class NotificationsApi {
  getNotifications = async (
    offset: Nullable<number> = null
  ): Promise<{
    meta: NotificationsMeta;
    notifications: Notification[];
  }> => {
    const response = await baseApi.get(NotificationsApiRoutes.GET_NOTIFICATIONS, {
      params: {
        limit: NOTIFICATIONS_LIMIT,
        offset,
      },
    });
    const { meta, notifications: dtos } = response.data as NotificationsResult;

    return {
      meta,
      notifications: Notification.fromDtos(dtos),
    };
  };

  getUnseenCount = async (): Promise<number> => {
    const response = await baseApi.get(NotificationsApiRoutes.GET_UNSEEN_NOTIFICATIONS_COUNT);

    return response.data;
  };

  markAllAsSeen = async (): Promise<void> => {
    await baseApi.put(NotificationsApiRoutes.SEEN_ALL_NOTIFICATIONS);
  };

  markAsSeen = async (id: number): Promise<void> => {
    await baseApi.put(UrlTemplateUtil.toPath(NotificationsApiRoutes.SEEN_NOTIFICATION, { id }));
  };
}

export const notificationsApi = new NotificationsApi();
