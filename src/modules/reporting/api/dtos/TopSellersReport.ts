import type { QuantityAmount, UserQuantityAmount } from '../../shared';

export interface TopSellersReport {
  users: UserQuantityAmount[];
  others: QuantityAmount;
  total: QuantityAmount;
}
