import type { PagingMeta } from '@/shared';
import type { TopSellersUser } from '../../shared';

export interface SellersRatingReport {
  users: TopSellersUser[];
  meta: PagingMeta;
}
