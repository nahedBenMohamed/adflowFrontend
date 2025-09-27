import type { PagingMeta } from '@/shared';
import type { SellersRatingReport } from '../../../../api';
import type { TopSellersUser } from './TopSellersUser';

export class SellersRating {
  users: TopSellersUser[];
  meta: PagingMeta;

  constructor({ users, meta }: SellersRating) {
    this.users = users;
    this.meta = meta;
  }

  static fromDto(dto: SellersRatingReport): SellersRating {
    return new SellersRating({
      meta: dto.meta,
      users: dto.users,
    });
  }
}
