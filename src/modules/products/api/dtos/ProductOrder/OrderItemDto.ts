import { Reservation, type OrderItemRow } from '../../../shared';
import { ProductInfoDto } from '../Product/ProductInfoDto';
import type { ReservationDto } from './ReservationDto';

export class OrderItemDto {
  id: number;
  unitPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  productId: number;
  sortOrder: number;
  reservations: ReservationDto[];
  productInfo: ProductInfoDto;

  constructor({
    id,
    unitPrice,
    quantity,
    tax,
    discount,
    productId,
    sortOrder,
    reservations,
    productInfo,
  }: OrderItemDto) {
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

  static fromOrderItemRow({
    model,
    warehousesEnabled,
  }: {
    model: OrderItemRow;
    warehousesEnabled: boolean;
  }): OrderItemDto {
    const isService = model.product.isService();

    const orderQuantity =
      isService || !warehousesEnabled
        ? model.quantity.asNumber()
        : model.reservations.reduce<number>((acc, curr) => acc + curr.quantity, 0);

    return new OrderItemDto({
      id: model.id,
      quantity: orderQuantity,
      tax: model.tax.asNumber(),
      sortOrder: model.sortOrder,
      productId: model.product.id,
      unitPrice: model.price.asNumber(),
      discount: model.discount.asNumber(),
      reservations: isService ? [] : Reservation.toDtos(model.reservations),
      productInfo: new ProductInfoDto({ id: model.product.id, name: model.product.name }),
    });
  }

  static fromOrderItemRows({
    models,
    warehousesEnabled,
  }: {
    models: OrderItemRow[];
    warehousesEnabled: boolean;
  }): OrderItemDto[] {
    return models.map<OrderItemDto>(m =>
      OrderItemDto.fromOrderItemRow({ model: m, warehousesEnabled })
    );
  }
}
