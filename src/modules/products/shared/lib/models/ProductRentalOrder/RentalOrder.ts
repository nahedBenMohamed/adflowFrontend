import { UtcDate, type Currency, type EntityInfo, type Nullable } from '@/shared';
import type { RentalOrderDto } from '../../../../api';
import { DatePeriod } from './DatePeriod';
import { RentalOrderItem } from './RentalOrderItem';
import type { RentalOrderStatus } from './RentalOrderStatus';

export class RentalOrder {
  id: number;
  sectionId: number;
  warehouseId: Nullable<number>;
  entityInfo: EntityInfo;
  status: RentalOrderStatus;
  periods: DatePeriod[];
  items: RentalOrderItem[];
  currency: Currency;
  taxIncluded: boolean;
  orderNumber: number;
  createdBy: number;
  createdAt: UtcDate;

  constructor({
    id,
    sectionId,
    warehouseId,
    entityInfo,
    status,
    periods,
    items,
    currency,
    taxIncluded,
    orderNumber,
    createdBy,
    createdAt,
  }: {
    id: number;
    sectionId: number;
    warehouseId: Nullable<number>;
    entityInfo: EntityInfo;
    status: RentalOrderStatus;
    periods: DatePeriod[];
    items: RentalOrderItem[];
    currency: Currency;
    taxIncluded: boolean;
    orderNumber: number;
    createdBy: number;
    createdAt: UtcDate;
  }) {
    this.id = id;
    this.sectionId = sectionId;
    this.warehouseId = warehouseId;
    this.entityInfo = entityInfo;
    this.status = status;
    this.periods = periods;
    this.items = items;
    this.currency = currency;
    this.taxIncluded = taxIncluded;
    this.orderNumber = orderNumber;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }

  static fromDto(dto: RentalOrderDto): RentalOrder {
    return new RentalOrder({
      id: dto.id,
      sectionId: dto.sectionId,
      warehouseId: dto.warehouseId,
      entityInfo: dto.entityInfo,
      status: dto.status,
      periods: DatePeriod.fromDtos(dto.periods),
      items: RentalOrderItem.fromDtos(dto.items),
      currency: dto.currency,
      taxIncluded: dto.taxIncluded,
      orderNumber: dto.orderNumber,
      createdBy: dto.createdBy,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }

  static fromDtos(dtos: RentalOrderDto[]): RentalOrder[] {
    return dtos.map(this.fromDto);
  }
}
