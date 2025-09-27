import type { DataStore } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { orderStatusStore } from './OrderStatusStore';

class ProductsModuleStore implements DataStore {
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async (): Promise<void> => {
    await Promise.all([orderStatusStore.loadData()]);

    this.isLoaded = true;
  };

  reset = (): void => {
    this.isLoaded = false;
  };
}

export const productsModuleStore = new ProductsModuleStore();
