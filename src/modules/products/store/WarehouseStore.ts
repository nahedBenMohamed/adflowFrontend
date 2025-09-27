import type { Option, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { warehouseApi, type CreateWarehouseDto, type UpdateWarehouseDto } from '../api';
import type { Warehouse } from '../shared';

export class WarehouseStore {
  sectionId: number;

  private _warehouses: Warehouse[] = [];

  isLoading = false;
  isLoaded = false;

  constructor(sectionId: number) {
    this.sectionId = sectionId;

    makeAutoObservable(this);
  }

  get activeWarehouses(): Warehouse[] {
    return this._warehouses.filter(w => !w.isDeleted);
  }

  get accessibleWarehouses(): Warehouse[] {
    return this.activeWarehouses.filter(
      w => w.userRights.canView && w.userRights.canEdit && w.userRights.canDelete
    );
  }

  get warehousesOptions(): Option<number>[] {
    return this.activeWarehouses.map(w => ({
      value: w.id,
      label: w.name,
    }));
  }

  getWarehouseById = (id: number): Warehouse => {
    const warehouse = this._warehouses.find(w => w.id === id);

    if (!warehouse) throw new Error(`Warehouse with id ${id} was not found`);

    return warehouse;
  };

  findWarehouseById = (id: number): Optional<Warehouse> => {
    return this._warehouses.find(w => w.id === id);
  };

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;

      this._warehouses = await warehouseApi.getWarehouses(this.sectionId);
    } catch (e) {
      throw new Error(`Error while loading _warehouses: ${e}`);
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  addWarehouse = async (dto: CreateWarehouseDto): Promise<void> => {
    try {
      const createdWarehouse = await warehouseApi.addWarehouse({ sectionId: this.sectionId, dto });

      this._warehouses = [...this._warehouses, createdWarehouse];
    } catch (e) {
      throw new Error(`Error while adding warehouse: ${e}`);
    }
  };

  updateWarehouse = async (warehouseId: number, dto: UpdateWarehouseDto): Promise<void> => {
    try {
      const updatedWarehouse = await warehouseApi.updateWarehouse({
        sectionId: this.sectionId,
        warehouseId,
        dto,
      });

      this._warehouses = this._warehouses.map<Warehouse>(w =>
        w.id === warehouseId ? updatedWarehouse : w
      );
    } catch (e) {
      throw new Error(`Error while updating warehouse: ${e}`);
    }
  };

  deleteWarehouse = async ({
    warehouseId,
    newWarehouseId,
  }: {
    warehouseId: number;
    newWarehouseId?: number;
  }): Promise<void> => {
    try {
      await warehouseApi.deleteWarehouse({
        sectionId: this.sectionId,
        warehouseId,
        newWarehouseId,
      });

      this._warehouses = this._warehouses.map<Warehouse>(w =>
        w.id === warehouseId ? { ...w, isDeleted: true } : w
      );
    } catch (e) {
      throw new Error(`Error while deleting warehouse: ${e}`);
    }
  };
}
