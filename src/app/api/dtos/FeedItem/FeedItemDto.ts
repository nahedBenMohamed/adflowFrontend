import { type FeedItemType } from '../../../../modules/card/shared/lib/models/FeedItemType';

export interface FeedItemDto {
  id: number;
  type: FeedItemType;
  data: object;
  createdAt: string;
}
