import { UtcDate } from '@/shared';

const FEED_ITEM_OUTLINED_PERIOD_IN_SECONDS = 10;

export const isFeedItemOutlined = (createdAt: UtcDate) =>
  Math.abs(createdAt.diff(UtcDate.now())) < FEED_ITEM_OUTLINED_PERIOD_IN_SECONDS;
