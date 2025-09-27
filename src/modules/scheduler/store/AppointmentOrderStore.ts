import { generalSettingsStore } from '@/app';
import {
  CreateOrderDto,
  UpdateOrderDto,
  productApi,
  productOrderApi,
  type Order,
  type OrderItemDto,
  type Product,
} from '@/modules/products';
import {
  Currency,
  JsonStateHelper,
  SelectModel,
  validateForm,
  type Nullable,
  type Optional,
} from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { ScheduleAppointmentOrderItemRow } from '../shared';

class AppointmentOrderStore {
  entityId: number;
  sectionId: number;
  orderId: Nullable<number>;

  order: Nullable<Order> = null;

  orderItemRows: ScheduleAppointmentOrderItemRow[] = [];

  currentCurrency: SelectModel;

  products: Product[] = [];

  rowsInitialized = false;
  orderUpdating = false;
  orderCreating = false;

  jsonState: Nullable<JsonStateHelper>;

  initializeJsonState = (): void => {
    this.jsonState = new JsonStateHelper(() =>
      JSON.stringify([this.orderItemRows, this.currentCurrency.value])
    );

    this.jsonState.calculateState();
  };

  initializeOrderSelects = (): void => {
    const defaultCurrency = generalSettingsStore.accountSettings?.currency;

    this.currentCurrency = SelectModel.create(
      this.order?.currency ?? defaultCurrency ?? Currency.USD
    );
  };

  constructor({
    entityId,
    sectionId,
    orderId,
  }: {
    entityId: number;
    sectionId: number;
    orderId: Nullable<number>;
  }) {
    this.orderId = orderId;
    this.sectionId = sectionId;
    this.entityId = entityId;

    this.jsonState = null;

    this.initializeOrderSelects();

    makeAutoObservable(this);
  }

  get totalAmount(): number {
    return this.orderItemRows.reduce((total, curr) => total + curr.getAmount(), 0);
  }

  get sortedOrderItemRows(): ScheduleAppointmentOrderItemRow[] {
    return this.orderItemRows.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get orderItemDtos(): OrderItemDto[] {
    return this.orderItemRows.map(r => r.toDto());
  }

  loadProducts = async (productIds: number[]): Promise<void> => {
    const productsResult = await productApi.getProductsByIds({
      sectionId: this.sectionId,
      ids: productIds,
    });

    this.products = productsResult.products;
  };

  findProductById = (productId: number): Optional<Product> => {
    return this.products.find(p => p.id === productId);
  };

  initializeOrderItemRows = async (): Promise<void> => {
    if (!this.orderId) {
      this.rowsInitialized = true;

      this.initializeJsonState();

      return;
    }

    try {
      this.order = await productOrderApi.getEntityProductOrder({
        orderId: this.orderId,
        expand: 'items',
      });

      await this.loadProducts(this.order.items.map<number>(oi => oi.productId));

      const orderItemRows: ScheduleAppointmentOrderItemRow[] = [];

      for (const oi of this.order.items) {
        const product = this.findProductById(oi.productId);

        if (!product) throw new Error(`Product with id ${oi.productId} not found`);

        const row = ScheduleAppointmentOrderItemRow.create({
          id: oi.id,
          price: oi.unitPrice,
          discount: oi.discount,
          product,
          quantity: oi.quantity,
          maxDiscount: null,
          sortOrder: oi.sortOrder,
        });

        orderItemRows.push(row);
      }

      this.orderItemRows = orderItemRows;
    } catch (e) {
      throw new Error(`Error while initializing order item rows: ${e}`);
    } finally {
      this.rowsInitialized = true;

      this.initializeJsonState();
    }
  };

  getMaxSortOrder = (): number => {
    return this.orderItemRows.reduce(
      (max, curr) => (curr.sortOrder > max ? curr.sortOrder : max),
      0
    );
  };

  addOrderItemRow = (product: Product): void => {
    let minId = this.orderItemRows.reduce((min, curr) => (curr.id < min ? curr.id : min), 0);
    let maxSortOrder = this.getMaxSortOrder();

    this.products.push(product);

    const price = product.prices.find(p => p.currency === this.currentCurrency.value);
    const unitPrice = price ? price.unitPrice : 0;
    const maxDiscount = price ? price.maxDiscount : null;

    const row = ScheduleAppointmentOrderItemRow.create({
      id: --minId,
      price: unitPrice,
      discount: 0,
      product,
      quantity: 1,
      maxDiscount,
      sortOrder: ++maxSortOrder,
    });

    this.orderItemRows = [...this.orderItemRows, row];
  };

  removeOrderItemRow = (id: number): void => {
    this.orderItemRows = this.orderItemRows.filter(r => r.id !== id);
  };

  createOrder = async (): Promise<Order> => {
    try {
      this.orderCreating = true;

      const dto = new CreateOrderDto({
        entityId: this.entityId,
        currency: this.currentCurrency.value,
        items: this.orderItemDtos,
        // since appointment order could only contain services for now
        statusId: null,
        warehouseId: null,
        cancelAfter: null,
        taxIncluded: false,
      });

      return await productOrderApi.createEntityProductOrder({ sectionId: this.sectionId, dto });
    } catch (e) {
      throw new Error(`Error while creating order: ${e}`);
    } finally {
      this.orderCreating = false;
    }
  };

  updateOrder = async (orderId: number): Promise<Order> => {
    try {
      this.orderUpdating = true;

      const dto = new UpdateOrderDto({
        currency: this.currentCurrency.value,
        items: this.orderItemDtos,
        // since appointment order could only contain services for now
        statusId: null,
        warehouseId: null,
        cancelAfter: null,
        taxIncluded: false,
      });

      return await productOrderApi.updateEntityProductOrder({
        sectionId: this.sectionId,
        orderId,
        dto,
      });
    } catch (e) {
      throw new Error(`Error while updating order: ${e}`);
    } finally {
      this.orderUpdating = false;
    }
  };

  validate = (): boolean => {
    return validateForm(this.orderItemRows);
  };

  @computed.struct
  isJsonStateChanged = () => {
    if (this.jsonState) {
      return this.jsonState.stateChanged;
    }

    return false;
  };
}

export { AppointmentOrderStore };
