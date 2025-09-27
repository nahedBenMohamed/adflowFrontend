import type { Nullable, Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { productApi, productRentalOrderApi } from '../api';
import { RentalShipmentItemRow, type Product, type RentalOrder } from '../shared';

export class RentalShipmentStore {
  sectionId: number;
  shipmentId: number;

  shipment: Nullable<RentalOrder> = null;
  products: Product[] = [];
  rentalShipmentItemRows: RentalShipmentItemRow[] = [];

  isLoading = false;
  isLoaded = false;

  constructor({ sectionId, shipmentId }: { sectionId: number; shipmentId: number }) {
    this.sectionId = sectionId;
    this.shipmentId = shipmentId;

    makeAutoObservable(this);
  }

  get allRowsChecked(): boolean {
    return this.rentalShipmentItemRows.every(r => r.checked);
  }

  get someRowsChecked(): boolean {
    if (this.allRowsChecked) return false;

    return this.rentalShipmentItemRows.some(r => r.checked);
  }

  loadData = async (): Promise<void> => {
    try {
      this.isLoading = true;
      this.isLoaded = false;

      this.shipment = await productRentalOrderApi.getEntityRentalProductOrder({
        sectionId: this.sectionId,
        orderId: this.shipmentId,
      });

      const { products } = await productApi.getProductsByIds({
        sectionId: this.sectionId,
        ids: this.shipment.items.map<number>(i => i.productId),
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

    if (!product) throw new Error(`Product with id ${productId} was not found`);

    return product;
  };

  findRowByProductId = (productId: number): Optional<RentalShipmentItemRow> => {
    return this.rentalShipmentItemRows.find(r => r.product.id === productId);
  };

  initializeRows = async (): Promise<void> => {
    await this.loadData();

    if (!this.shipment) {
      throw new Error(`Failed to initialize rows: shipment is null`);
    }

    const currency = this.shipment.currency;
    const taxIncluded = this.shipment.taxIncluded;

    this.rentalShipmentItemRows = this.shipment.items.map<RentalShipmentItemRow>(
      i =>
        new RentalShipmentItemRow({
          currency,
          tax: i.tax,
          taxIncluded,
          checked: false,
          discount: i.discount,
          unitPrice: i.unitPrice,
          product: this.getProductById(i.productId),
        })
    );
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
    const allChecked = this.rentalShipmentItemRows.every(r => r.checked);

    this.rentalShipmentItemRows.forEach(r => (r.checked = !allChecked));
  };

  uncheckAllRows = (): void => {
    this.rentalShipmentItemRows.forEach(r => (r.checked = false));
  };
}
