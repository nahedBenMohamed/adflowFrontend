import type { Nullable } from '@/shared';

export interface TopSellersWithOthers {
  userId: Nullable<number>;
  amount: number;
  quantity: number;
}
