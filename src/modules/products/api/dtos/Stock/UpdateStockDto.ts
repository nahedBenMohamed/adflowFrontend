import type { Nullable } from '@/shared';

export class UpdateStockDto {
  warehouseId: number;
  // if null provided – stock will be deleted
  stockQuantity: Nullable<number>;

  constructor({ warehouseId, stockQuantity }: UpdateStockDto) {
    this.warehouseId = warehouseId;
    this.stockQuantity = stockQuantity;
  }
}
