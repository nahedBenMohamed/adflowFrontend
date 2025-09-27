import { makeAutoObservable } from 'mobx';
import type { Product } from './Product';

export class RentalProductRow {
  id: number;
  product: Product;

  constructor({ id, product }: RentalProductRow) {
    this.id = id;
    this.product = product;

    makeAutoObservable(this);
  }

  static createFromProduct(product: Product): RentalProductRow {
    return new RentalProductRow({ id: product.id, product });
  }

  static createFromProducts(products: Product[]): RentalProductRow[] {
    return products.map<RentalProductRow>(this.createFromProduct);
  }
}
