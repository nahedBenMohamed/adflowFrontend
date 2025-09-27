import { OrderItemDto, ProductInfoDto, type Product } from '@/modules/products';
import { InputModel, type Nullable } from '@/shared';
import Decimal from 'decimal.js';
import { computed, makeAutoObservable } from 'mobx';

export class ScheduleAppointmentOrderItemRow {
  id: number;
  price: InputModel;
  discount: InputModel;
  quantity: InputModel;
  service: Product;
  maxDiscount: Nullable<number>;
  sortOrder: number;

  constructor({
    id,
    price,
    discount,
    quantity,
    product,
    maxDiscount,
    sortOrder,
  }: {
    id: number;
    price: InputModel;
    discount: InputModel;
    quantity: InputModel;
    product: Product;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }) {
    this.id = id;
    this.price = price;
    this.discount = discount;
    this.quantity = quantity;
    this.service = product;
    this.maxDiscount = maxDiscount;
    this.sortOrder = sortOrder;

    makeAutoObservable(this);
  }

  static create({
    id,
    price,
    discount,
    product,
    quantity,
    maxDiscount,
    sortOrder,
  }: {
    id: number;
    price: number;
    discount: number;
    product: Product;
    quantity: number;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }): ScheduleAppointmentOrderItemRow {
    const quantityModel = InputModel.createFromNumber(quantity).required().number().min(1);

    return new ScheduleAppointmentOrderItemRow({
      id,
      product,
      sortOrder,
      maxDiscount,
      quantity: quantityModel,
      price: InputModel.createFromNumber(price).required().number(),
      discount: InputModel.createFromNumber(discount).required().number(),
    });
  }

  @computed.struct
  getAmount = (): number => {
    if (!this.price.value || !this.discount.value) return 0;

    if (isNaN(this.price.asNumber()) || isNaN(this.discount.asNumber())) return 0;

    const amount = new Decimal(this.price.value).mul(this.quantity.asNumber());
    const discountTotal = amount.mul(new Decimal(this.discount.value).div(100));

    return amount.sub(discountTotal).toNumber();
  };

  toDto = (): OrderItemDto => {
    return new OrderItemDto({
      id: this.id,
      tax: 0,
      reservations: [],
      sortOrder: this.sortOrder,
      productId: this.service.id,
      unitPrice: this.price.asNumber(),
      quantity: this.quantity.asNumber(),
      discount: this.discount.asNumber(),
      productInfo: new ProductInfoDto({ id: this.service.id, name: this.service.name }),
    });
  };
}
