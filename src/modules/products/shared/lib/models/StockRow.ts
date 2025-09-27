import { InputModel, type Nullable } from '@/shared';
import { UpdateStockDto } from '../../../api';
import type { Stock } from './Stock/Stock';
import type { Warehouse } from './Warehouse/Warehouse';

export class ProductStockRow {
  warehouse: Warehouse;
  stock: Nullable<Stock>;
  stockQuantity: InputModel;

  constructor({ warehouse, stock = null }: { warehouse: Warehouse; stock?: Nullable<Stock> }) {
    this.warehouse = warehouse;
    this.stock = stock;
    this.stockQuantity = InputModel.createFromNumber(stock ? stock.stockQuantity : 0);
  }

  toUpdateStockDto = (): UpdateStockDto => {
    return new UpdateStockDto({
      warehouseId: this.warehouse.id,
      stockQuantity: this.stockQuantity.asNumber(),
    });
  };
}
