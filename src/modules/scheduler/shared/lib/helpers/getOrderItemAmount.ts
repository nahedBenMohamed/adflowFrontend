import type { OrderItem } from '@/modules/products';
import Decimal from 'decimal.js';

export const getOrderItemAmount = (orderItem: OrderItem): number => {
  const amount = new Decimal(orderItem.unitPrice).mul(orderItem.quantity);

  const discountTotal = amount.mul(new Decimal(orderItem.discount).div(100));

  return amount.sub(discountTotal).toNumber();
};
