import type { Nullable, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { productApi, shipmentApi } from '../api';
import { ShipmentItemRow, type Product, type Shipment } from '../shared';

export class ShipmentStore {
  sectionId: number;
  shipmentId: number;

  shipment: Nullable<Shipment> = null;
  products: Product[] = [];
  shipmentItemRows: ShipmentItemRow[] = [];

  isLoading = false;
  isLoaded = false;

  constructor({ sectionId, shipmentId }: { sectionId: number; shipmentId: number }) {
    this.sectionId = sectionId;
    this.shipmentId = shipmentId;

    makeAutoObservable(this);
  }

  get allRowsChecked(): boolean {
    return this.shipmentItemRows.every(r => r.checked);
  }

  get someRowsChecked(): boolean {
    if (this.allRowsChecked) return false;

    return this.shipmentItemRows.some(r => r.checked);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;
      this.isLoaded = false;

      this.shipment = await shipmentApi.getShipment({
        sectionId: this.sectionId,
        shipmentId: this.shipmentId,
      });

      const { products } = await productApi.getProductsByIds({
        sectionId: this.sectionId,
        ids: this.shipment.items.map(i => i.productId),
      });

      this.products = products;
    } catch (e) {
      throw new Error(`Error while loading data: ${e}`);
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  getProductById = (productId: number): Product => {
    const product = this.products.find(p => p.id === productId);

    if (!product) throw new Error(`Product with id ${productId} not found`);

    return product;
  };

  initializeRows = async (): Promise<void> => {
    await this.loadData();

    if (!this.shipment) throw new Error(`Failed to initialize rows: shipment is null`);

    this.shipmentItemRows = this.shipment.items.map<ShipmentItemRow>(
      i =>
        new ShipmentItemRow({
          checked: false,
          shipmentItem: i,
          product: this.getProductById(i.productId),
        })
    );
  };

  changeShipmentStatus = async (statusId: number): Promise<void> => {
    try {
      const updatedShipment = await shipmentApi.changeShipmentStatus({
        sectionId: this.sectionId,
        shipmentId: this.shipmentId,
        statusId,
      });

      this.shipment = updatedShipment;
    } catch (e) {
      throw new Error(
        `Error while changing shipment status ${this.shipment?.statusId} to ${statusId}: ${e}`
      );
    }
  };

  findRowByProductId = (productId: number): Optional<ShipmentItemRow> => {
    return this.shipmentItemRows.find(r => r.product.id === productId);
  };

  checkRow = (rowProductId: number): boolean => {
    const row = this.findRowByProductId(rowProductId);

    if (!row) return false;

    row.checked = true;

    return true;
  };

  toggleCheckRow = (rowProductId: number): boolean => {
    const row = this.findRowByProductId(rowProductId);

    if (!row) return false;

    row.checked = !row.checked;

    return true;
  };

  toggleCheckAllRows = (): void => {
    const allChecked = this.shipmentItemRows.every(r => r.checked);

    this.shipmentItemRows.forEach(r => (r.checked = !allChecked));
  };

  uncheckAllRows = (): void => {
    this.shipmentItemRows.forEach(r => (r.checked = false));
  };
}
