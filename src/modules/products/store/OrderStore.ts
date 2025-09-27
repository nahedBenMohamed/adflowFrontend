import { generalSettingsStore } from '@/app';
import {
  ConvertTimeUtil,
  Currency,
  JsonStateHelper,
  SelectModel,
  validateForm,
  type Nullable,
  type Optional,
} from '@/shared';
import { computed, makeAutoObservable, reaction, type IReactionDisposer } from 'mobx';
import {
  CreateOrderDto,
  OrderItemDto,
  UpdateOrderDto,
  invalidateEntityProductOrdersInCache,
  invalidateGetProductsQuery,
  productApi,
  productOrderApi,
} from '../api';
import {
  OrderItemRow,
  ProductRow,
  Reservation,
  TaxStrategy,
  type Order,
  type Product,
  type ProductsSection,
  type Warehouse,
} from '../shared';
import { orderStatusStore } from './OrderStatusStore';

export class OrderStore {
  orderItemRows: OrderItemRow[] = [];
  productRows: ProductRow[] = [];
  products: Product[] = [];

  order: Nullable<Order> = null;

  entityId: number;
  productsSection: ProductsSection;
  orderId: Nullable<number> = null;

  currentCurrency: SelectModel;
  currentStatus: SelectModel;
  taxStrategy: SelectModel;
  currentWarehouse: SelectModel;

  // in seconds
  cancelAfter: Nullable<number> = null;

  warehousesEnabled: boolean;

  orderLoaded = false;
  orderCreating = false;
  orderUpdating = false;
  orderDataInitializing = false;

  orderJsonState: Nullable<JsonStateHelper> = null;

  setOrderIdParam: (orderId: number) => void;

  get sortedOrderItemRows() {
    return this.orderItemRows.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  initializeOrderSelects = (): void => {
    const defaultCurrency = generalSettingsStore.accountSettings?.currency;

    this.currentCurrency = SelectModel.create(defaultCurrency ?? Currency.USD);

    this.currentStatus = SelectModel.create();
    this.taxStrategy = SelectModel.create(TaxStrategy.INCLUDED);
    this.currentWarehouse = SelectModel.create();
  };

  initializeJsonState = (): void => {
    this.orderJsonState = new JsonStateHelper(() =>
      JSON.stringify([
        this.orderItemRows.map(oi => ({
          ...oi,
          quantity: { 0: oi.quantity.value, 1: oi.quantity.isValid() },
        })),
        this.taxStrategy.value,
        this.currentStatus.value,
        this.currentWarehouse.value,
        this.currentCurrency.value,
        this.cancelAfter,
      ])
    );

    this.orderJsonState.calculateState();
  };

  initializeOrderData = async (preloadedOrder?: Order): Promise<void> => {
    try {
      if (!preloadedOrder) {
        const order = await this.loadOrder();

        this.order = order;
      } else {
        this.order = preloadedOrder;
      }

      if (!this.order) return;

      if (!preloadedOrder) {
        this.orderDataInitializing = true;

        await this.loadProducts(this.order.items.map(oi => oi.productId));
      }

      this.setOrderData(this.order);

      const orderItemRows: OrderItemRow[] = [];

      for (const oi of this.order.items) {
        const product = this.findProductById(oi.productId);

        if (!product) throw new Error(`Product with id ${oi.productId} not found`);

        const row = OrderItemRow.create({
          id: oi.id,
          product,
          tax: oi.tax,
          maxDiscount: null,
          price: oi.unitPrice,
          quantity: oi.quantity,
          sortOrder: oi.sortOrder,
          reservations: oi.reservations,
          discount: oi.discount > 0 ? oi.discount : null,
        });

        orderItemRows.push(row);
      }

      this.orderItemRows = orderItemRows;
    } catch (e) {
      throw new Error(`Error while initializing order data: ${e}`);
    } finally {
      this.orderDataInitializing = false;

      this.initializeJsonState();
    }
  };

  getMaxSortOrder = (): number => {
    return this.orderItemRows.reduce<number>(
      (max, curr) => (curr.sortOrder > max ? curr.sortOrder : max),
      0
    );
  };

  constructor({
    entityId,
    productsSection,
    orderId,
    warehousesEnabled,
    setOrderIdParam,
  }: {
    entityId: number;
    productsSection: ProductsSection;
    orderId: Nullable<number>;
    warehousesEnabled: boolean;
    setOrderIdParam: (orderId: number) => void;
  }) {
    this.entityId = entityId;
    this.productsSection = productsSection;
    this.orderId = orderId;

    this.warehousesEnabled = warehousesEnabled;

    if (!orderId)
      this.cancelAfter = productsSection.cancelAfter
        ? ConvertTimeUtil.getSecondsFromHours(productsSection.cancelAfter)
        : null;

    this.setOrderIdParam = setOrderIdParam;

    this.initializeOrderSelects();

    makeAutoObservable(this);
  }

  setOrderRowMaxDiscountById = ({
    rowId,
    maxDiscount,
  }: {
    rowId: number;
    maxDiscount: number;
  }): void => {
    const orderItemRow = this.getOrderItemRow(rowId);

    orderItemRow.maxDiscount = maxDiscount;
  };

  setProductRows = ({
    warehouses,
    products,
  }: {
    warehouses: Warehouse[];
    products: Product[];
  }): void => {
    this.productRows = ProductRow.createFromProducts(
      products,
      warehouses,
      this.getCurrentWarehouseId()
    );
  };

  setCurrentWarehouseId = (warehouseId: Nullable<number>): void => {
    this.currentWarehouse.setValue(warehouseId);
  };

  filterOrderItemRowsByWarehouse = (): IReactionDisposer => {
    const disposeReaction = reaction(
      () => this.currentWarehouse.value,
      () => {
        if (this.currentWarehouse.value) {
          this.orderItemRows = this.orderItemRows.filter(
            r =>
              r.product.stocks.find(
                s => s.warehouseId === this.currentWarehouse.value && s.available > 0
              ) || r.product.isService()
          );
        }
      }
    );

    return disposeReaction;
  };

  setOrderData = (order: Order): void => {
    this.order = order;
    this.entityId = order.entityId;

    this.currentCurrency = SelectModel.create(order.currency);
    this.currentStatus = SelectModel.create(order.statusId);
    this.taxStrategy = SelectModel.create(
      order.taxIncluded ? TaxStrategy.INCLUDED : TaxStrategy.EXCLUDED
    );
    this.currentWarehouse = SelectModel.create(order.warehouseId);
    this.cancelAfter = order.cancelAfter
      ? ConvertTimeUtil.getSecondsFromHours(order.cancelAfter)
      : null;
  };

  setCancelAfter = (value: Nullable<number>): void => {
    this.cancelAfter = value;
  };

  loadProducts = async (productIds: number[]): Promise<void> => {
    const productsResult = await productApi.getProductsByIds({
      sectionId: this.productsSection.id,
      ids: productIds,
    });

    this.products = productsResult.products;
  };

  findProductById = (productId: number): Optional<Product> => {
    return this.products.find(p => p.id === productId);
  };

  loadOrder = async (): Promise<Nullable<Order>> => {
    try {
      if (!this.orderId) return null;

      this.orderLoaded = false;

      return await productOrderApi.getEntityProductOrder({
        orderId: this.orderId,
        expand: 'items',
      });
    } catch (e) {
      throw new Error(`Error while loading order ${this.orderId}: ${e}`);
    } finally {
      this.orderLoaded = true;
    }
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.orderJsonState) return this.orderJsonState.stateChanged;

    return false;
  };

  getCurrentWarehouseId = (): Nullable<number> => {
    return this.currentWarehouse.value ? (this.currentWarehouse.value as number) : null;
  };

  getCurrentStatusId = (): Nullable<number> => {
    if (!this.warehousesEnabled) return null;

    return this.currentStatus.value ? (this.currentStatus.value as number) : null;
  };

  generatePossibleReservation = (
    warehouses: Warehouse[],
    productRow: ProductRow
  ): Reservation[] => {
    if (warehouses.length > 1) {
      const warehouseWithAvailableStockId =
        productRow.product.getFirstWarehouseWithAvailableStockId();

      if (warehouseWithAvailableStockId)
        return [new Reservation({ warehouseId: warehouseWithAvailableStockId, quantity: 1 })];
    }

    return [];
  };

  addOrderItemRows = ({
    warehouses,
    productRows,
  }: {
    warehouses: Warehouse[];
    productRows: ProductRow[];
  }): void => {
    let minId = this.orderItemRows.reduce<number>(
      (min, curr) => (curr.id < min ? curr.id : min),
      0
    );
    let maxSortOrder = this.getMaxSortOrder();

    for (const pr of productRows) {
      const { product } = pr;

      this.products.push(product);

      const price = product.prices.find(p => p.currency === this.currentCurrency.value);
      const unitPrice = price ? price.unitPrice : 0;
      const maxDiscount = price ? price.maxDiscount : null;
      const reservations = this.warehousesEnabled
        ? product.isService()
          ? []
          : pr.reservations.length
            ? pr.reservations
            : this.generatePossibleReservation(warehouses, pr)
        : [];

      const row = OrderItemRow.create({
        id: --minId,
        product,
        maxDiscount,
        reservations,
        discount: null,
        price: unitPrice,
        tax: product.tax ?? 0,
        sortOrder: ++maxSortOrder,
        quantity: pr.quantity.asNumber() ? pr.quantity.asNumber() : 1,
      });

      // if already added -> skip
      if (this.orderItemRows.some(oi => oi.product.id === pr.id)) continue;

      this.orderItemRows = [...this.orderItemRows, row];
    }

    // clear reservations for all added product rows to avoid conflicts
    // this.productRows.forEach(r => (r.reservations = this.generatePossibleReservation(r)));
    this.productRows
      .filter(r => productRows.map<number>(pr => pr.id).includes(r.id))
      .forEach(r => {
        if (this.warehousesEnabled)
          r.reservations = this.generatePossibleReservation(warehouses, r);
      });
  };

  removeOrderItemRows = (ids: number[]): void => {
    this.orderItemRows = this.orderItemRows.filter(r => !ids.includes(r.id));
  };

  getOrderItemRow = (id: number): OrderItemRow => {
    const orderItemRow = this.orderItemRows.find(r => r.id === id);

    if (!orderItemRow) throw new Error(`Order item row with id ${id} not found`);

    return orderItemRow;
  };

  // @ts-ignore
  onCurrencyChange = (_currency: Currency): void => {
    // this.orderItemRows.forEach(row => {
    //   const product = this.getProductById(row.product.id);
    //   const mappedProductPrice = product.prices.find(p => p.currency === currency);
    //   const mappedOrderPrice = this.findInitialOrderItem(row.id)?.unitPrice;
    //   if (currency === this.order?.currency && mappedOrderPrice) {
    //     row.price.setNumberValue(mappedOrderPrice);
    //     return;
    //   }
    //   row.price.setNumberValue(mappedProductPrice ? mappedProductPrice.unitPrice : 0);
    // });
  };

  @computed.struct
  totalAmount = (): number => {
    const taxIncluded = this.taxStrategy.value === TaxStrategy.INCLUDED;

    return this.orderItemRows.reduce<number>(
      (total, curr) =>
        total +
        curr.getAmount({
          taxIncluded,
          warehousesEnabled: this.warehousesEnabled,
          currentWarehouseId: this.getCurrentWarehouseId(),
          statusCode: this.order?.statusId
            ? orderStatusStore.getById(this.order.statusId).code
            : undefined,
        }),
      0
    );
  };

  save = async ({
    setIdToParam,
    returnStocks,
  }: {
    setIdToParam?: boolean;
    returnStocks?: boolean;
  }): Promise<void> => {
    if (!validateForm(this.orderItemRows)) return;

    if (this.order) {
      await this.updateOrder({ orderId: this.order.id, returnStocks });
    } else {
      const { id } = await this.createOrder(this.entityId);

      if (setIdToParam) this.setOrderIdParam(id);
    }

    invalidateEntityProductOrdersInCache(this.entityId);
    invalidateGetProductsQuery(this.productsSection.id);
  };

  getInitialOrderStatus = (): Nullable<number> => {
    if (!this.warehousesEnabled) return null;

    if (this.currentStatus.value) return this.currentStatus.value;

    const firstOrderStatus = orderStatusStore.statuses[0];

    if (!firstOrderStatus)
      throw new Error(
        'No order statuses were found. At least one status is required to create an order'
      );

    return firstOrderStatus.id;
  };

  invalidateProductRows = (): void => {
    this.productRows.map<ProductRow>(pr => {
      const product = this.findProductById(pr.id);

      if (product) pr.product = product;

      return pr;
    });
  };

  createOrder = async (entityId: number): Promise<Order> => {
    this.orderJsonState = null;

    try {
      this.orderCreating = true;

      const dto = new CreateOrderDto({
        entityId,
        currency: this.currentCurrency.value,
        taxIncluded: this.taxStrategy.value === TaxStrategy.INCLUDED,
        statusId: this.getInitialOrderStatus(),
        items: OrderItemDto.fromOrderItemRows({
          models: this.orderItemRows,
          warehousesEnabled: this.warehousesEnabled,
        }),
        warehouseId: this.getCurrentWarehouseId(),
        // cancelAfter should be in hours in the dto
        cancelAfter: this.cancelAfter
          ? ConvertTimeUtil.getHoursFromSeconds(this.cancelAfter)
          : null,
      });

      return await productOrderApi.createEntityProductOrder({
        sectionId: this.productsSection.id,
        dto,
      });
    } catch (e) {
      throw new Error(`Error while creating order: ${e}`);
    } finally {
      this.orderCreating = false;
    }
  };

  updateOrder = async ({
    orderId,
    returnStocks,
  }: {
    orderId: number;
    returnStocks?: boolean;
  }): Promise<Order> => {
    try {
      this.orderUpdating = true;

      const dto = new UpdateOrderDto({
        statusId: this.getCurrentStatusId(),
        currency: this.currentCurrency.value,
        warehouseId: this.getCurrentWarehouseId(),
        taxIncluded: this.taxStrategy.value === TaxStrategy.INCLUDED,
        items: OrderItemDto.fromOrderItemRows({
          models: this.orderItemRows,
          warehousesEnabled: this.warehousesEnabled,
        }),
        // cancelAfter should be in hours in the dto
        cancelAfter: this.cancelAfter
          ? ConvertTimeUtil.getHoursFromSeconds(this.cancelAfter)
          : null,
      });

      const updatedOrder = await productOrderApi.updateEntityProductOrder({
        sectionId: this.productsSection.id,
        orderId,
        dto,
        returnStocks,
      });

      await this.loadProducts(updatedOrder.items.map(oi => oi.productId));

      this.invalidateProductRows();
      this.initializeOrderData(updatedOrder);

      return updatedOrder;
    } catch (e) {
      throw new Error(`Error while updating order: ${e}`);
    } finally {
      this.orderUpdating = false;
    }
  };

  saveOrderItemRowReservations = (orderItemRowId: number, reservations: Reservation[]): void => {
    const orderItemRow = this.getOrderItemRow(orderItemRowId);

    if (!orderItemRow) throw new Error(`Order item row with id ${orderItemRowId} not found`);

    orderItemRow.reservations = reservations;
  };

  saveProductRowReservations = ({
    productRowId,
    reservations,
  }: {
    productRowId: number;
    reservations: Reservation[];
  }): void => {
    const productRow = this.productRows.find(r => r.id === productRowId);

    if (!productRow) throw new Error(`Product row with id ${productRowId} not found`);

    productRow.reservations = reservations;
  };

  cancelChanges = (): void => {
    if (this.order) {
      this.initializeOrderData(this.order);
    } else {
      this.initializeOrderSelects();
      this.orderItemRows = [];

      this.initializeJsonState();
    }
  };

  hasProductWithAvailableStock = (): boolean => {
    return this.productRows.some(r => r.getAvailable(this.getCurrentWarehouseId()) > 0);
  };

  wasProductRowAlreadyAdded = (productRowId: number): boolean => {
    return this.orderItemRows.some(oi => oi.product.id === productRowId);
  };

  hasAvailableProducts = (): boolean => {
    return this.productRows.some(pr => !this.wasProductRowAlreadyAdded(pr.id));
  };
}
