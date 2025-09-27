import { makeAutoObservable } from 'mobx';
import type { Product } from '../Product/Product';
import type { ShipmentItem } from './ShipmentItem';

export class ShipmentItemRow {
  shipmentItem: ShipmentItem;
  product: Product;
  checked: boolean;

  constructor({
    shipmentItem,
    product,
    checked,
  }: {
    shipmentItem: ShipmentItem;
    product: Product;
    checked: boolean;
  }) {
    this.shipmentItem = shipmentItem;
    this.product = product;
    this.checked = checked;

    makeAutoObservable(this);
  }
}
