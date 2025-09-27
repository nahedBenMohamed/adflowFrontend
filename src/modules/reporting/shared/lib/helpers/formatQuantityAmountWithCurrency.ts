import { currencyFormatterHelper, type Currency, type Nullable } from '@/shared';
import type { QuantityAmount } from '../models';

export const formatQuantityAmountWithCurrency = ({
  currency,
  qAmount,
}: {
  currency: Currency;
  qAmount?: Nullable<QuantityAmount>;
}): string =>
  `${qAmount?.quantity ?? 0} | ${currencyFormatterHelper.format({
    value: qAmount?.amount ?? 0,
    currency,
  })}`;
