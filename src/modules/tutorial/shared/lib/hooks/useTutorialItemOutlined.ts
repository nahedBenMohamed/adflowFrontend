import type { UtcDate, UtcDateValue } from '@/shared';

export const useTutorialItemOutlined = ({
  createdAt,
  lastOpenedDate,
}: {
  createdAt: UtcDate;
  lastOpenedDate: UtcDateValue;
}): boolean => (lastOpenedDate ? createdAt.greaterOrEqualThan(lastOpenedDate) : true);
