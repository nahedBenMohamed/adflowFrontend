import { JsonStateHelper } from '@/shared';
import { computed } from 'mobx';
import type { Stock, Warehouse } from '../shared';
import { ProductStockRow } from '../shared/lib';

export class ProductStockBlockStore {
  warehouses: Warehouse[] = [];
  stocks: Stock[] = [];
  stockRows: ProductStockRow[] = [];

  jsonState: JsonStateHelper;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() => JSON.stringify(this.stockRows));

    this.jsonState.calculateState();
  };

  initializeStockRows = (): void => {
    if (this.warehouses.length) {
      const rows: ProductStockRow[] = [];

      this.warehouses.forEach(warehouse => {
        const stock = this.stocks.find(s => s.warehouseId === warehouse.id);

        rows.push(new ProductStockRow({ warehouse, stock }));
      });

      this.stockRows = rows;
    }
  };

  constructor({ warehouses, stocks }: { warehouses: Warehouse[]; stocks: Stock[] }) {
    this.stocks = stocks;
    this.warehouses = warehouses;

    this.initializeStockRows();
    this.initializeJsonState();
  }

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.jsonState) return this.jsonState.stateChanged;

    return false;
  };

  handleCancel = (): void => {
    this.jsonState.clearState();

    this.initializeStockRows();
    this.initializeJsonState();
  };
}
