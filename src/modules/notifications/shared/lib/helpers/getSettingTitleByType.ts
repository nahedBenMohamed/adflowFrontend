import { entityTypeStore } from '@/app';
import type { TFunction } from 'i18next';
import { NotificationType, type NotificationTypeSettings } from '../models';

export const getSettingTitleByType = ({
  typeSettings,
  t,
}: {
  typeSettings: NotificationTypeSettings;
  t: TFunction;
}): string => {
  switch (typeSettings.type) {
    case NotificationType.ENTITY_NEW:
      return `${t('new')} ${
        typeSettings.objectId ? entityTypeStore.getById(typeSettings.objectId).name : t('object')
      }`;

    case NotificationType.MAIL_NEW:
      return t('new_mail');

    case NotificationType.CHAT_MESSAGE_NEW:
      return t('new_chat_message');

    case NotificationType.ENTITY_NOTE_NEW:
      return t('new_note');

    case NotificationType.ENTITY_RESPONSIBLE_CHANGE:
      return t('entity_responsible_change');

    case NotificationType.TASK_COMMENT_NEW:
      return t('new_task_comment');

    case NotificationType.ENTITY_IMPORT_COMPLETED:
      return t('entity_import_complete');

    default:
      return t('unknown');
  }
};
