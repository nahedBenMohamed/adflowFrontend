import type { UpdateStockDto } from './UpdateStockDto';

export class UpdateStocksDto {
  stocks: UpdateStockDto[];

  constructor(stocks: UpdateStockDto[]) {
    this.stocks = stocks;
  }
}
