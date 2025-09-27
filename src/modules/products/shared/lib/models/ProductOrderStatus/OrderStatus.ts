import type { OrderStatusCode } from './OrderStatusCode';

export interface OrderStatus {
  id: number;
  name: string;
  color: string;
  code: OrderStatusCode;
  sortOrder: number;
}
