import { Currency, InputModel, SelectModel, validateForm, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { CreateProductPriceDto } from '../../../api';
import type { ProductPrice } from './ProductPrice/ProductPrice';

export class PriceForm {
  id: Nullable<number> = null;
  name: InputModel;
  unitPrice: InputModel;
  currency: SelectModel;
  maxDiscount: InputModel;

  constructor({
    id,
    name,
    unitPrice,
    currency,
    maxDiscount,
  }: {
    id: Nullable<number>;
    name: InputModel;
    unitPrice: InputModel;
    currency: SelectModel;
    maxDiscount: InputModel;
  }) {
    this.id = id;
    this.name = name;
    this.unitPrice = unitPrice;
    this.currency = currency;
    this.maxDiscount = maxDiscount;

    makeAutoObservable(this);
  }

  static create(defaultCurrency: Currency = Currency.USD): PriceForm {
    return new PriceForm({
      id: null,
      name: InputModel.create(),
      unitPrice: InputModel.create().required().number(),
      currency: SelectModel.create(defaultCurrency),
      maxDiscount: InputModel.create().number(),
    });
  }

  static fromPrice(price: ProductPrice): PriceForm {
    return new PriceForm({
      id: price.id,
      name: InputModel.create(price.name ?? ''),
      unitPrice: InputModel.createFromNumber(price.unitPrice).required().number(),
      currency: SelectModel.create(price.currency),
      maxDiscount: InputModel.createFromNumber(price.maxDiscount ?? undefined),
    });
  }

  reset = (): void => {
    this.name = InputModel.create();
    this.unitPrice = InputModel.create().required().number();
    this.maxDiscount = InputModel.create();
  };

  toDto = (): CreateProductPriceDto => {
    return new CreateProductPriceDto({
      name: this.name.valueOrNull(),
      unitPrice: Number(this.unitPrice.value),
      currency: this.currency.value as Currency,
      maxDiscount: Number(this.maxDiscount.value),
    });
  };

  validate = (): boolean => {
    return validateForm(this);
  };
}
