import { baseApi } from '@/app';
import { NotificationSettings } from '../../shared';
import { NotificationsApiRoutes } from '../NotificationsApiRoutes';
import type { NotificationSettingsDto } from '../dtos';

class NotificationsSettingsApi {
  getNotificationsSettings = async (): Promise<NotificationSettings> => {
    const response = await baseApi.get(NotificationsApiRoutes.GET_NOTIFICATIONS_SETTINGS);

    return NotificationSettings.fromDto(response.data);
  };

  updateNotificationsSettings = async (
    dto: NotificationSettingsDto
  ): Promise<NotificationSettings> => {
    const response = await baseApi.put(NotificationsApiRoutes.UPDATE_NOTIFICATIONS_SETTINGS, dto);

    return NotificationSettings.fromDto(response.data);
  };
}

export const notificationsSettingsApi = new NotificationsSettingsApi();
