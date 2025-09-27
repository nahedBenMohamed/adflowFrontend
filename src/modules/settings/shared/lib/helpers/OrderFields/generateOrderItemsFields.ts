import type { TFunction } from 'i18next';
import type { OrderField } from '../../models';

export const generateOrderItemsFields = (t: TFunction): OrderField[] => [
  {
    name: t('order_item.number'),
    defaultCode: 'number',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.name'),
    defaultCode: 'name',
  },
  {
    name: t('order_item.price'),
    defaultCode: 'price',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.currency'),
    defaultCode: 'currency',
  },
  {
    name: t('order_item.discount'),
    defaultCode: 'discount',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.tax'),
    defaultCode: 'tax',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.quantity'),
    defaultCode: 'quantity',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.amount'),
    defaultCode: 'amount',
    showNumberToWordSelector: true,
  },
];
