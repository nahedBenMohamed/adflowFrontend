import type { Currency } from '@/shared';
import Decimal from 'decimal.js';
import { computed, makeAutoObservable } from 'mobx';
import type { Product } from '../Product/Product';

export class RentalShipmentItemRow {
  unitPrice: number;
  currency: Currency;
  tax: number;
  taxIncluded: boolean;
  discount: number;
  product: Product;
  checked: boolean;

  constructor({
    unitPrice,
    currency,
    tax,
    taxIncluded,
    discount,
    product,
    checked,
  }: {
    unitPrice: number;
    currency: Currency;
    tax: number;
    taxIncluded: boolean;
    discount: number;
    product: Product;
    checked: boolean;
  }) {
    this.unitPrice = unitPrice;
    this.currency = currency;
    this.tax = tax;
    this.taxIncluded = taxIncluded;
    this.discount = discount;
    this.product = product;
    this.checked = checked;

    makeAutoObservable(this);
  }

  @computed.struct
  getAmount = (): number => {
    if (isNaN(this.unitPrice) || isNaN(this.discount) || isNaN(this.tax)) return 0;

    const amount = new Decimal(this.unitPrice);

    const discountTotal = amount.mul(new Decimal(this.discount).div(100));

    if (this.taxIncluded) return amount.sub(discountTotal).toNumber();

    const taxTotal = amount.mul(new Decimal(this.tax).div(100));

    return amount.add(taxTotal).sub(discountTotal).toNumber();
  };
}
