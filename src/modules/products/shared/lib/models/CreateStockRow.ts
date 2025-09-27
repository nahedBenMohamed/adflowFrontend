import { InputModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { UpdateStockDto } from '../../../api';

export class CreateStockRow {
  warehouseId: number;
  stockQuantity: InputModel;

  private constructor({
    warehouseId,
    stockQuantity,
  }: {
    warehouseId: number;
    stockQuantity: InputModel;
  }) {
    this.warehouseId = warehouseId;
    this.stockQuantity = stockQuantity;

    makeAutoObservable(this);
  }

  static create({
    warehouseId,
    stockQuantity,
  }: {
    warehouseId: number;
    stockQuantity: number;
  }): CreateStockRow {
    return new CreateStockRow({
      warehouseId,
      stockQuantity: InputModel.createFromNumber(stockQuantity).required().number().min(0),
    });
  }

  toUpdateStockDto = (): UpdateStockDto => {
    return new UpdateStockDto({
      warehouseId: this.warehouseId,
      stockQuantity: this.stockQuantity.asNumber(),
    });
  };
}
