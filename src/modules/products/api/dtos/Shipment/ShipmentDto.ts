import type { EntityInfo, Nullable } from '@/shared';
import type { ShipmentItemDto } from './ShipmentItemDto';

export interface ShipmentDto {
  id: number;
  name: string;
  orderId: number;
  statusId: number;
  createdAt: string;
  sectionId: number;
  warehouseId: number;
  items: ShipmentItemDto[];
  shippedAt: Nullable<string>;
  entityInfo: EntityInfo;
}
