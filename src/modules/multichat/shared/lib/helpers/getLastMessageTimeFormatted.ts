import { UtcDate } from '@/shared';

export const getLastMessageTimeFormatted = (lastMessageTime: UtcDate): string => {
  const currentDate = UtcDate.now();

  if (currentDate.diffDays(lastMessageTime) <= 1) return lastMessageTime.displayTime();

  if (currentDate.diffDays(lastMessageTime) <= 7) return lastMessageTime.format('ddd');

  return lastMessageTime.displayShort();
};
