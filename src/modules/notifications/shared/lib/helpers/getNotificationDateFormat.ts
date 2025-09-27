import type { UtcDate } from '@/shared';
import type { TFunction } from 'i18next';

export const getNotificationDateFormat = ({ date, t }: { date: UtcDate; t: TFunction }): string => {
  if (date.isToday()) return date.displayTime();

  if (date.isYesterday()) return t('yesterday', { time: date.displayTime() });

  return t('date', { date: date.format('D MMMM'), time: date.displayTime() });
};
