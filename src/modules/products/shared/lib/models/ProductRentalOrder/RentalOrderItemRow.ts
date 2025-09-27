import { InputModel, type Nullable } from '@/shared';
import { Decimal } from 'decimal.js';
import { computed, makeAutoObservable } from 'mobx';
import type { Product } from '../Product/Product';

export class RentalOrderItemRow {
  id: number;
  price: InputModel;
  tax: InputModel;
  discount: InputModel;
  product: Product;
  maxDiscount: Nullable<number> = null;
  sortOrder: number;

  private constructor({
    id,
    price,
    tax,
    discount,
    product,
    maxDiscount,
    sortOrder,
  }: {
    id: number;
    price: InputModel;
    tax: InputModel;
    discount: InputModel;
    product: Product;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }) {
    this.id = id;
    this.price = price;
    this.tax = tax;
    this.discount = discount;
    this.product = product;
    this.maxDiscount = maxDiscount;
    this.sortOrder = sortOrder;

    makeAutoObservable(this);
  }

  static create({
    id,
    price,
    tax,
    discount,
    product,
    maxDiscount,
    sortOrder,
  }: {
    id: number;
    price: number;
    tax: number;
    discount: Nullable<number>;
    product: Product;
    maxDiscount: Nullable<number>;
    sortOrder: number;
  }): RentalOrderItemRow {
    return new RentalOrderItemRow({
      id,
      price: InputModel.createFromNumber(price).required().number(),
      tax: InputModel.createFromNumber(tax).required().number(),
      discount: InputModel.createFromNumber(discount ?? undefined).number(),
      product,
      maxDiscount,
      sortOrder,
    });
  }

  @computed.struct
  getAmount = (taxIncluded: boolean, numberOfDays: number): number => {
    if (!this.price.value) return 0;

    const discount = this.discount.asNumber() || 0;
    const tax = this.discount.asNumber() || 0;

    if (isNaN(this.price.asNumber())) return 0;

    const amount = new Decimal(this.price.asNumber());
    const discountTotal = amount.mul(new Decimal(discount).div(100));

    if (taxIncluded) return amount.sub(discountTotal).mul(numberOfDays).toNumber();

    const taxTotal = amount.mul(new Decimal(tax).div(100));

    return amount.add(taxTotal).sub(discountTotal).mul(numberOfDays).toNumber();
  };
}
