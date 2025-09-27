import type { TopSellersReport } from '../../../../api';
import type { QuantityAmount } from '../QuantityAmount';
import type { UserQuantityAmount } from '../UserQuantityAmount';

export class TopSellers {
  users: UserQuantityAmount[];
  others: QuantityAmount;
  total: QuantityAmount;

  constructor({ users, others, total }: TopSellersReport) {
    this.users = users;
    this.others = others;
    this.total = total;
  }

  static fromDto(dto: TopSellersReport): TopSellers {
    return new TopSellers({
      users: dto.users,
      others: dto.others,
      total: dto.total,
    });
  }
}
