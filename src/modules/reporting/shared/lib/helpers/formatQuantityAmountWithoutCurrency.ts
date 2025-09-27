import type { Nullable } from '@/shared';
import type { QuantityAmount } from '../models';

export const formatQuantityAmountWithoutCurrency = (qAmount?: Nullable<QuantityAmount>): string =>
  `${qAmount?.quantity ?? 0} | ${qAmount?.amount ?? 0}`;
