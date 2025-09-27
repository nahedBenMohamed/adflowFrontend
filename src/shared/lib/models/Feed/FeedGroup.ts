import { type UtcDate } from '../UtcDate';
import { type FeedItem } from './FeedItem';

export interface FeedGroup {
  date: UtcDate;
  items: FeedItem[];
}
