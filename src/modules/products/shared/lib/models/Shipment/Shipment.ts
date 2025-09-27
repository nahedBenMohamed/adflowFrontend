import { UtcDate, type EntityInfo, type UtcDateValue } from '@/shared';
import type { ShipmentDto } from '../../../../api';
import { orderStatusStore } from '../../../../store';
import { OrderStatusCode } from '../ProductOrderStatus/OrderStatusCode';
import { ShipmentItem } from './ShipmentItem';

export class Shipment {
  id: number;
  name: string;
  warehouseId: number;
  orderId: number;
  statusId: number;
  shippedAt: UtcDateValue;
  items: ShipmentItem[];
  entityInfo: EntityInfo;
  createdAt: UtcDate;
  sectionId: number;

  constructor({
    id,
    name,
    warehouseId,
    orderId,
    statusId,
    shippedAt,
    items,
    entityInfo,
    createdAt,
    sectionId,
  }: {
    id: number;
    name: string;
    warehouseId: number;
    orderId: number;
    statusId: number;
    shippedAt: UtcDateValue;
    items: ShipmentItem[];
    entityInfo: EntityInfo;
    createdAt: UtcDate;
    sectionId: number;
  }) {
    this.id = id;
    this.name = name;
    this.warehouseId = warehouseId;
    this.orderId = orderId;
    this.statusId = statusId;
    this.shippedAt = shippedAt;
    this.items = items;
    this.entityInfo = entityInfo;
    this.createdAt = createdAt;
    this.sectionId = sectionId;
  }

  static fromDto(dto: ShipmentDto): Shipment {
    return new Shipment({
      id: dto.id,
      name: dto.name,
      orderId: dto.orderId,
      statusId: dto.statusId,
      sectionId: dto.sectionId,
      entityInfo: dto.entityInfo,
      warehouseId: dto.warehouseId,
      items: ShipmentItem.fromDtos(dto.items),
      createdAt: UtcDate.parseISO(dto.createdAt),
      shippedAt: UtcDate.parseISONullable(dto.shippedAt),
    });
  }

  static fromDtos(dtos: ShipmentDto[]): Shipment[] {
    return dtos.map(this.fromDto);
  }

  isShipped = (): boolean => {
    const status = orderStatusStore.getById(this.statusId);

    return status.code === OrderStatusCode.SHIPPED;
  };
}
