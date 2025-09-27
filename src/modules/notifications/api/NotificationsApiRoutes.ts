export enum NotificationsApiRoutes {
  GET_NOTIFICATIONS = '/api/notifications',
  GET_UNSEEN_NOTIFICATIONS_COUNT = '/api/notifications/unseen-count',
  SEEN_ALL_NOTIFICATIONS = '/api/notifications/seen',
  SEEN_NOTIFICATION = '/api/notifications/:id/seen',
  // settings
  GET_NOTIFICATIONS_SETTINGS = '/api/notifications/settings',
  UPDATE_NOTIFICATIONS_SETTINGS = '/api/notifications/settings',
}
