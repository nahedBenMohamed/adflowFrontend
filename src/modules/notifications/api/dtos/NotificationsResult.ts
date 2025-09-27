import type { NotificationDto } from './NotificationDto';
import type { NotificationsMeta } from './NotificationsMeta';

export interface NotificationsResult {
  notifications: NotificationDto[];
  meta: NotificationsMeta;
}
