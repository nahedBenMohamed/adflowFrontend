import { UtcDate, type Currency, type Nullable, type UtcDateValue } from '@/shared';
import type { OrderDto } from '../../../../api';
import { OrderItem } from './OrderItem';

export class Order {
  id: number;
  entityId: number;
  sectionId: number;
  currency: Currency;
  taxIncluded: boolean;
  items: OrderItem[];
  statusId: Nullable<number>;
  totalAmount: number;
  warehouseId: Nullable<number>;
  orderNumber: number;
  createdBy: number;
  createdAt: UtcDate;
  shippedAt: UtcDateValue;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    id,
    entityId,
    sectionId,
    currency,
    taxIncluded,
    items,
    statusId,
    totalAmount,
    warehouseId,
    orderNumber,
    createdBy,
    createdAt,
    shippedAt,
    cancelAfter,
  }: Order) {
    this.id = id;
    this.entityId = entityId;
    this.sectionId = sectionId;
    this.currency = currency;
    this.taxIncluded = taxIncluded;
    this.items = items;
    this.statusId = statusId;
    this.totalAmount = totalAmount;
    this.warehouseId = warehouseId;
    this.orderNumber = orderNumber;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.shippedAt = shippedAt;
    this.cancelAfter = cancelAfter;
  }

  static fromDto(dto: OrderDto): Order {
    return new Order({
      id: dto.id,
      entityId: dto.entityId,
      sectionId: dto.sectionId,
      currency: dto.currency,
      statusId: dto.statusId,
      createdBy: dto.createdBy,
      warehouseId: dto.warehouseId,
      totalAmount: dto.totalAmount,
      orderNumber: dto.orderNumber,
      taxIncluded: dto.taxIncluded,
      items: OrderItem.fromDtos(dto.items),
      createdAt: UtcDate.parseISO(dto.createdAt),
      shippedAt: UtcDate.parseISONullable(dto.shippedAt),
      cancelAfter: dto.cancelAfter,
    });
  }

  static fromDtos(dtos: OrderDto[]): Order[] {
    return dtos.map(this.fromDto);
  }
}
