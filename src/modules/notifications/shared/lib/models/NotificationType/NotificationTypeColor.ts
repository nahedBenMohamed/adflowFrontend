import { NotificationType } from './NotificationType';

export const NotificationTypeColor: Record<
  NotificationType,
  {
    textColor: string;
    bgColor: string;
    borderColor?: string;
  }
> = {
  [NotificationType.TASK_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-green-default)',
  },
  [NotificationType.TASK_OVERDUE]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-red-default)',
  },
  [NotificationType.TASK_BEFORE_START]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-green-default)',
  },
  [NotificationType.TASK_OVERDUE_EMPLOYEE]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-red-default)',
  },
  [NotificationType.ACTIVITY_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-green-default)',
  },
  [NotificationType.ACTIVITY_OVERDUE]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-red-default)',
  },
  [NotificationType.ACTIVITY_BEFORE_START]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-green-default)',
  },
  [NotificationType.ACTIVITY_OVERDUE_EMPLOYEE]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--button-text-red-default)',
  },
  [NotificationType.TASK_COMMENT_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: '#03C2EB',
  },
  [NotificationType.CHAT_MESSAGE_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--primary-blue)',
  },
  [NotificationType.MAIL_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--primary-statuses-orange-440)',
  },
  [NotificationType.ENTITY_NOTE_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--primary-statuses-fuchsia-400)',
  },
  [NotificationType.ENTITY_NEW]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--primary-statuses-fuchsia-400)',
  },
  [NotificationType.ENTITY_RESPONSIBLE_CHANGE]: {
    textColor: 'var(--primary-statuses-white-0)',
    bgColor: 'var(--primary-statuses-fuchsia-400)',
  },
  [NotificationType.ENTITY_IMPORT_COMPLETED]: {
    textColor: 'var(--primary-blue)',
    bgColor: 'var(--primary-statuses-white-0)',
    borderColor: 'var(--primary-blue)',
  },
};
