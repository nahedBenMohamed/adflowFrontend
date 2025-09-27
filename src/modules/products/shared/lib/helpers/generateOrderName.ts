import type { TFunction } from 'i18next';

export const generateOrderName = ({
  orderNumber,
  t,
}: {
  orderNumber: number;
  t: TFunction;
}): string => t('order', { number: orderNumber });
