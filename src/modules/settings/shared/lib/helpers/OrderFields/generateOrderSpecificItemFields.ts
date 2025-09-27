import type { TFunction } from 'i18next';
import type { OrderField } from '../../models';

export const generateOrderSpecificItemFields = (t: TFunction): OrderField[] => [
  {
    name: t('order_item.number'),
    defaultCode: 'order.products[0].number',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.name'),
    defaultCode: 'order.products[0].name',
  },
  {
    name: t('order_item.price'),
    defaultCode: 'order.products[0].price',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.currency'),
    defaultCode: 'order.products[0].currency',
  },
  {
    name: t('order_item.discount'),
    defaultCode: 'order.products[0].discount',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.tax'),
    defaultCode: 'order.products[0].tax',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.quantity'),
    defaultCode: 'order.products[0].quantity',
    showNumberToWordSelector: true,
  },
  {
    name: t('order_item.amount'),
    defaultCode: 'order.products[0].amount',
    showNumberToWordSelector: true,
  },
];
