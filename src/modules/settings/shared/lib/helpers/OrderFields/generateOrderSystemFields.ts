import type { TFunction } from 'i18next';
import type { OrderField } from '../../models';

export const generateOrderSystemFields = (t: TFunction): OrderField[] => [
  {
    name: t('order_number'),
    defaultCode: 'order.number',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_amount'),
    defaultCode: 'order.total',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_currency'),
    defaultCode: 'order.currency',
  },
];
