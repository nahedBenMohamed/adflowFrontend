import { InputModel, type Nullable } from '@/shared';
import { Decimal } from 'decimal.js';
import { computed, makeAutoObservable, toJS } from 'mobx';
import type { Product } from '../Product/Product';
import { OrderStatusCode } from '../ProductOrderStatus/OrderStatusCode';
import type { Reservation } from './Reservation';

export class OrderItemRow {
  id: number;
  price: InputModel;
  tax: InputModel;
  discount: InputModel;
  product: Product;
  reservations: Reservation[];
  // for correct maxQuantity calculations when some stock is reserved,
  // this value should not be mutated after it's set
  initialReservations: Reservation[];
  quantity: InputModel;
  maxDiscount: Nullable<number> = null;
  sortOrder: number;

  private constructor({
    id,
    price,
    tax,
    discount,
    product,
    reservations,
    quantity,
    maxDiscount = null,
    sortOrder,
  }: {
    id: number;
    price: InputModel;
    tax: InputModel;
    discount: InputModel;
    product: Product;
    reservations: Reservation[];
    quantity: InputModel;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }) {
    this.id = id;
    this.price = price;
    this.tax = tax;
    this.discount = discount;
    this.product = product;
    this.reservations = reservations;
    this.quantity = quantity;
    this.maxDiscount = maxDiscount;
    this.sortOrder = sortOrder;

    this.initialReservations = toJS(reservations);

    makeAutoObservable(this);
  }

  static create({
    id,
    price,
    tax,
    discount,
    product,
    reservations,
    quantity,
    maxDiscount = null,
    sortOrder,
  }: {
    id: number;
    price: number;
    tax: number;
    discount: Nullable<number>;
    product: Product;
    reservations: Reservation[];
    quantity: number;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }): OrderItemRow {
    const quantityModel = InputModel.createFromNumber(quantity).required().number().min(1);

    return new OrderItemRow({
      id,
      price: InputModel.createFromNumber(price).required().number(),
      tax: InputModel.createFromNumber(tax).required().number(),
      discount: InputModel.createFromNumber(discount ?? undefined).number(),
      product,
      reservations,
      quantity: quantityModel,
      maxDiscount,
      sortOrder,
    });
  }

  @computed.struct
  getQuantity = ({
    warehousesEnabled,
    orderWarehouseId = null,
    statusCode,
  }: {
    warehousesEnabled: boolean;
    orderWarehouseId?: Nullable<number>;
    statusCode?: OrderStatusCode;
  }): number => {
    if (
      !warehousesEnabled ||
      this.product.isService() ||
      (statusCode &&
        [OrderStatusCode.SHIPPED, OrderStatusCode.RETURNED, OrderStatusCode.CANCELLED].includes(
          statusCode
        ))
    )
      return this.quantity.asNumber();

    return orderWarehouseId
      ? this.quantity.asNumber()
      : this.reservations.reduce<number>((acc, reservation) => acc + reservation.quantity, 0);
  };

  @computed.struct
  getAvailable = (warehouseId: Nullable<number>): number => {
    if (warehouseId) {
      const stock = this.product.stocks.find(s => s.warehouseId === warehouseId);

      if (!stock) throw new Error(`Stock for warehouse ${warehouseId} not found`);

      return stock.available;
    }

    return this.product.stocks.reduce<number>((acc, stock) => acc + stock.available, 0);
  };

  @computed.struct
  getAmount = ({
    taxIncluded,
    warehousesEnabled,
    currentWarehouseId,
    statusCode,
  }: {
    taxIncluded: boolean;
    warehousesEnabled: boolean;
    currentWarehouseId: Nullable<number>;
    statusCode?: OrderStatusCode;
  }): number => {
    if (!this.price.value) return 0;

    const discount = this.discount.asNumber() || 0;
    const tax = this.tax.asNumber() || 0;

    if (isNaN(this.price.asNumber())) return 0;

    const amount = new Decimal(this.price.asNumber()).mul(
      this.getQuantity({ warehousesEnabled, orderWarehouseId: currentWarehouseId, statusCode })
    );
    const discountTotal = amount.mul(new Decimal(discount).div(100));

    if (taxIncluded) return amount.sub(discountTotal).toNumber();

    const taxTotal = amount.mul(new Decimal(tax).div(100));

    return amount.add(taxTotal).sub(discountTotal).toNumber();
  };
}
