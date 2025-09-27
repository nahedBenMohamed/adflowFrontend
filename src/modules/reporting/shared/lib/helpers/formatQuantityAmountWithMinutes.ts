import { ConvertTimeUtil } from '@/shared';
import type { TFunction } from 'i18next';
import type { QuantityAmount } from '../models';

export const formatQuantityAmountWithMinutes = ({
  qAmount,
  t,
}: {
  qAmount?: QuantityAmount;
  t: TFunction;
}): string => {
  const minutes = qAmount?.amount ? ConvertTimeUtil.getMinutesFromSeconds(qAmount.amount) : 0;

  return `${qAmount?.quantity ?? 0} | ${minutes} ${t('min')}`;
};
