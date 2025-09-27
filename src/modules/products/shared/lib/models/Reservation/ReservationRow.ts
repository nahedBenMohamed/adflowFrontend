import { InputModel, type UserRights } from '@/shared';
import { Reservation } from '../ProductOrder/Reservation';
import type { Stock } from '../Stock/Stock';

export class ReservationRow {
  stock: Stock;
  warehouseName: string;
  quantity: InputModel;
  maxQuantity: number;
  warehouseUserRights: UserRights;

  private constructor({
    stock,
    warehouseName,
    quantity,
    maxQuantity,
    warehouseUserRights,
  }: {
    stock: Stock;
    warehouseName: string;
    quantity: InputModel;
    maxQuantity: number;
    warehouseUserRights: UserRights;
  }) {
    this.stock = stock;
    this.warehouseName = warehouseName;
    this.quantity = quantity;
    this.maxQuantity = maxQuantity;
    this.warehouseUserRights = warehouseUserRights;
  }

  static create({
    stock,
    warehouseName,
    quantity,
    maxQuantity,
    warehouseUserRights,
  }: {
    stock: Stock;
    warehouseName: string;
    quantity: number;
    maxQuantity: number;
    warehouseUserRights: UserRights;
  }): ReservationRow {
    return new ReservationRow({
      stock,
      maxQuantity,
      warehouseName,
      warehouseUserRights,
      quantity: InputModel.createFromNumber(quantity).required().number().min(0).max(maxQuantity),
    });
  }

  toReservation = (): Reservation => {
    return new Reservation({
      warehouseId: this.stock.warehouseId,
      quantity: this.quantity.asNumber(),
    });
  };
}
