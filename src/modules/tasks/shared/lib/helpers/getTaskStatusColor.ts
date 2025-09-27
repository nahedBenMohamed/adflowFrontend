import { TaskTimeStatus } from '@/shared';
import type { TaskViewStyles } from '../models';

export const getTaskStatusColor = (status: TaskTimeStatus): TaskViewStyles => {
  switch (status) {
    case TaskTimeStatus.RESOLVED:
    case TaskTimeStatus.ACTIVE_FUTURE:
      return {
        indicatorColor: 'var(--button-text-graphite-secondary-text)',
        bgColor: 'var(--primary-statuses-white-0)',
        borderColor: 'var(--graphite-graphite-120)',
      };

    case TaskTimeStatus.ACTIVE_TODAY:
      return {
        indicatorColor: 'var(--primary-statuses-green-520)',
        bgColor: 'var(--background-green-20)',
        borderColor: 'var(--secondary-green-280)',
      };

    case TaskTimeStatus.EXPIRED:
      return {
        indicatorColor: 'var(--primary-statuses-red-360)',
        bgColor: 'var(--background-red-20)',
        borderColor: 'var(--neutral-red-100)',
      };
  }
};
