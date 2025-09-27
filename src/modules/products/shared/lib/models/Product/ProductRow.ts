import { InputModel, type Nullable } from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { Reservation } from '../ProductOrder/Reservation';
import type { Warehouse } from '../Warehouse/Warehouse';
import type { Product } from './Product';
import { ProductType } from './ProductType';

export class ProductRow {
  id: number;
  quantity: InputModel;
  maxQuantity: Nullable<number> = null;
  product: Product;
  reservations: Reservation[];

  constructor({
    id,
    quantity,
    product,
    maxQuantity,
    reservations,
  }: {
    id: number;
    quantity: number;
    product: Product;
    maxQuantity: Nullable<number>;
    reservations: Reservation[];
  }) {
    this.id = id;
    this.quantity = InputModel.createFromNumber(quantity).min(1);
    this.product = product;
    this.maxQuantity = maxQuantity;
    this.reservations = reservations;

    if (maxQuantity) this.quantity.max(maxQuantity);

    makeAutoObservable(this);
  }

  static createFromProduct(
    product: Product,
    warehouses: Warehouse[],
    currentWarehouseId: Nullable<number>
  ): ProductRow {
    let reservations: Reservation[] = [];

    if (warehouses.length >= 1) {
      const warehouseWithAvailableStockId = product.getFirstWarehouseWithAvailableStockId();

      if (warehouseWithAvailableStockId)
        reservations.push(
          new Reservation({ warehouseId: warehouseWithAvailableStockId, quantity: 1 })
        );
    }

    return new ProductRow({
      product,
      quantity: 1,
      reservations,
      id: product.id,
      maxQuantity: product.getAvailable(currentWarehouseId),
    });
  }

  static createFromProducts(
    products: Product[],
    warehouses: Warehouse[],
    currentWarehouseId: Nullable<number>
  ): ProductRow[] {
    return products.map<ProductRow>(p =>
      ProductRow.createFromProduct(p, warehouses, currentWarehouseId)
    );
  }

  @computed.struct
  getAvailable = (warehouseId: Nullable<number>): number => {
    return this.product.getAvailable(warehouseId);
  };

  @computed.struct
  hasAvailable = (warehouseId: Nullable<number>): boolean => {
    if (this.product.type === ProductType.SERVICE) return true;

    return this.getAvailable(warehouseId) > 0;
  };

  @computed.struct
  getQuantity = (orderWarehouseId: Nullable<number> = null): number => {
    return orderWarehouseId
      ? this.quantity.asNumber()
      : this.reservations.reduce<number>((acc, reservation) => acc + reservation.quantity, 0);
  };
}
