import type { OrderItemDto, ReservationDto } from '../../../../api';
import { ProductInfo } from '../Product/ProductInfo';
import { Reservation } from './Reservation';

export class OrderItem {
  id: number;
  unitPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  productId: number;
  sortOrder: number;
  reservations: ReservationDto[];
  productInfo: ProductInfo;

  constructor({
    id,
    tax,
    discount,
    quantity,
    unitPrice,
    productId,
    sortOrder,
    reservations,
    productInfo,
  }: OrderItem) {
    this.id = id;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.tax = tax;
    this.discount = discount;
    this.productId = productId;
    this.sortOrder = sortOrder;
    this.reservations = reservations;
    this.productInfo = productInfo;
  }

  static fromDto(dto: OrderItemDto): OrderItem {
    return new OrderItem({
      id: dto.id,
      unitPrice: dto.unitPrice,
      quantity: dto.quantity,
      tax: dto.tax,
      discount: dto.discount,
      productId: dto.productId,
      sortOrder: dto.sortOrder,
      reservations: Reservation.fromDtos(dto.reservations),
      productInfo: ProductInfo.fromDto(dto.productInfo),
    });
  }

  static fromDtos(dtos: OrderItemDto[]): OrderItem[] {
    return dtos.map(this.fromDto);
  }
}
