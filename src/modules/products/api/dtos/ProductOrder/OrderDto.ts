import type { Currency, Nullable } from '@/shared';
import type { OrderItemDto } from './OrderItemDto';

export interface OrderDto {
  id: number;
  entityId: number;
  sectionId: number;
  currency: Currency;
  taxIncluded: boolean;
  items: OrderItemDto[];
  statusId: Nullable<number>;
  totalAmount: number;
  warehouseId: Nullable<number>;
  orderNumber: number;
  createdBy: number;
  createdAt: string;
  shippedAt: Nullable<string>;
  cancelAfter: Nullable<number>;
}
