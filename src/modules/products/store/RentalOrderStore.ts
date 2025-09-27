import { generalSettingsStore } from '@/app';
import { UuidUtil, type Nullable, type Optional } from '@/shared';
import { computed, makeAutoObservable, reaction, type IReactionDisposer } from 'mobx';
import { Currency, JsonStateHelper, SelectModel, validateForm } from '../../../shared';
import {
  CheckRentalStatusDto,
  CreateRentalOrderDto,
  DatePeriodDto,
  RentalOrderItemDto,
  UpdateRentalOrderDto,
  UpdateRentalOrderItemDto,
  invalidateEntityRentalProductOrdersInCache,
  invalidateGetProductsQuery,
  productApi,
  productRentalOrderApi,
} from '../api';
import {
  RentalOrderItemRow,
  RentalOrderStatus,
  RentalProductRow,
  RentalStatus,
  TaxStrategy,
  type Product,
  type ProductsSection,
  type RentalOrder,
  type UtcDatesRangeValueModel,
} from '../shared';

export class RentalOrderStore {
  orderItemRows: RentalOrderItemRow[] = [];
  productRows: RentalProductRow[] = [];
  products: Product[] = [];

  order: Nullable<RentalOrder> = null;
  periods: UtcDatesRangeValueModel[] = [];

  entityId: number;
  productsSection: ProductsSection;
  orderId: Nullable<number> = null;

  currentCurrency: SelectModel;
  currentStatus: SelectModel;
  taxStrategy: SelectModel;
  currentWarehouse: SelectModel;

  orderLoaded = false;
  orderDataInitializing = false;
  orderCreating = false;
  orderUpdating = false;
  productStatusesUpdating = false;

  orderJsonState: Nullable<JsonStateHelper> = null;

  setOrderIdParam: (orderId: number) => void;

  get sortedOrderItemRows() {
    return this.orderItemRows.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  get totalRentingDays(): number {
    return this.periods.reduce((total, curr) => {
      const [startDate, endDate] = curr.range;

      if ((startDate && !endDate) || (!startDate && endDate)) return total + 1;

      if (!startDate || !endDate) return total;

      if (endDate.isSameDay(startDate)) return total + 1;

      return total + Math.ceil(endDate.diffDays(startDate));
    }, 0);
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
        // attributes which we want to track in every orderItemRow
        this.orderItemRows.map(oi => ({
          0: oi.id,
          1: oi.discount,
          2: oi.sortOrder,
          3: oi.tax,
          4: oi.price,
        })),
        this.taxStrategy.value,
        this.currentStatus.value,
        this.currentCurrency.value,
        this.currentWarehouse.value,
        this.periods,
      ])
    );

    this.orderJsonState.calculateState();
  };

  initializePeriods = (): void => {
    if (!this.order) {
      return;
    }

    const periods: UtcDatesRangeValueModel[] = [];

    this.order.periods.forEach(p =>
      periods.push({ id: UuidUtil.generate(), range: [p.startDate, p.endDate] })
    );

    this.periods = periods;
  };

  initializeOrderData = async (preloadedOrder?: RentalOrder): Promise<void> => {
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
      this.initializePeriods();

      const orderItemRows: RentalOrderItemRow[] = [];

      for (const oi of this.order.items) {
        const product = this.findProductById(oi.productId);

        if (!product) throw new Error(`Rental product with id ${oi.productId} not found`);

        const row = RentalOrderItemRow.create({
          id: oi.id,
          product,
          tax: oi.tax,
          maxDiscount: null,
          price: oi.unitPrice,
          sortOrder: oi.sortOrder,
          discount: oi.discount > 0 ? oi.discount : null,
        });

        orderItemRows.push(row);
      }

      this.orderItemRows = orderItemRows;
    } catch (e) {
      throw new Error(`Error while initializing rental order data: ${e}`);
    } finally {
      this.orderDataInitializing = false;

      this.initializeJsonState();
    }
  };

  getMaxSortOrder = (): number => {
    return this.orderItemRows.reduce(
      (max, curr) => (curr.sortOrder > max ? curr.sortOrder : max),
      0
    );
  };

  constructor({
    orderId,
    entityId,
    productsSection,
    setOrderIdParam,
  }: {
    entityId: number;
    orderId: Nullable<number>;
    productsSection: ProductsSection;
    setOrderIdParam: (orderId: number) => void;
  }) {
    this.productsSection = productsSection;
    this.entityId = entityId;
    this.orderId = orderId;

    this.setOrderIdParam = setOrderIdParam;

    this.initializeOrderSelects();

    makeAutoObservable(this);
  }

  setOrderRowMaxDiscountById = (rowId: number, maxDiscount: number): void => {
    const orderItemRow = this.getOrderItemRow(rowId);

    orderItemRow.maxDiscount = maxDiscount;
  };

  setProductRows = (products: Product[]): void => {
    this.productRows = RentalProductRow.createFromProducts(products);
  };

  setCurrentWarehouseId = (warehouseId: Nullable<number>): void => {
    this.currentWarehouse.value = warehouseId;
  };

  hasValidPeriods = (): boolean => {
    return this.periods.some(p => p.range[0] || p.range[1]);
  };

  getValidPeriods = (): UtcDatesRangeValueModel[] => {
    return this.periods.filter(p => p.range[0] || p.range[1]);
  };

  findProductById = (productId: number): Optional<Product> => {
    return this.products.find(p => p.id === productId);
  };

  getCurrentWarehouseId = (): Nullable<number> => {
    return this.currentWarehouse.value ? this.currentWarehouse.value : null;
  };

  loadProducts = async (productIds: number[]): Promise<void> => {
    const productsResult = await productApi.getProductsByIds({
      sectionId: this.productsSection.id,
      ids: productIds,
    });

    this.products = productsResult.products;
  };

  loadOrder = async (): Promise<Nullable<RentalOrder>> => {
    try {
      if (!this.orderId) return null;

      this.orderLoaded = false;

      return await productRentalOrderApi.getEntityRentalProductOrder({
        sectionId: this.productsSection.id,
        orderId: this.orderId,
      });
    } catch (e) {
      throw new Error(`Error while loading rental order ${this.orderId}: ${e}`);
    } finally {
      this.orderLoaded = true;
    }
  };

  filterOrderItemRowsByWarehouse = (): IReactionDisposer => {
    const disposeReaction = reaction(
      () => this.currentWarehouse.value,
      () => {
        if (this.currentWarehouse.value) {
          this.orderItemRows = this.orderItemRows.filter(
            r =>
              r.product.stocks.find(s => s.warehouseId === this.currentWarehouse.value) ||
              r.product.isService()
          );
        }
      }
    );

    return disposeReaction;
  };

  updateOrderProductsRentalStatuses = (): IReactionDisposer => {
    const disposeReaction = reaction(
      () => this.periods.map(p => p.range[1]),
      () => {
        this.checkOrderProductsStatuses();
      }
    );

    return disposeReaction;
  };

  setOrderData = (order: RentalOrder): void => {
    this.order = order;
    this.entityId = order.entityInfo.id;

    this.currentCurrency = SelectModel.create(order.currency);
    this.currentStatus = SelectModel.create(order.status);
    this.taxStrategy = SelectModel.create(
      order.taxIncluded ? TaxStrategy.INCLUDED : TaxStrategy.EXCLUDED
    );
    this.currentWarehouse = SelectModel.create(order.warehouseId);
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (this.orderJsonState) return this.orderJsonState.stateChanged;

    return false;
  };

  invalidateProductRows = () => {
    this.productRows.map(pr => {
      const product = this.findProductById(pr.id);

      if (product) pr.product = product;

      return pr;
    });
  };

  getInitialOrderStatus = (): RentalOrderStatus => {
    if (this.currentStatus.value) {
      return this.currentStatus.value as RentalOrderStatus;
    }

    return RentalOrderStatus.FORMED;
  };

  getCurrentOrderStatus = (): RentalOrderStatus => {
    return this.currentStatus.value
      ? (this.currentStatus.value as RentalOrderStatus)
      : this.getInitialOrderStatus();
  };

  addOrderItemRows = (
    productRows: RentalProductRow[],
    periodModel?: UtcDatesRangeValueModel
  ): void => {
    let minId = this.orderItemRows.reduce((min, curr) => (curr.id < min ? curr.id : min), 0);
    let maxSortOrder = this.getMaxSortOrder();

    for (const pr of productRows) {
      const { product } = pr;

      this.products.push(product);

      const price = product.prices.find(p => p.currency === this.currentCurrency.value);
      const maxDiscount = price ? price.maxDiscount : null;
      const unitPrice = price ? price.unitPrice : 0;

      const row = RentalOrderItemRow.create({
        id: --minId,
        price: unitPrice,
        tax: product.tax ?? 0,
        discount: null,
        product: { ...product, rentalStatus: null },
        maxDiscount,
        sortOrder: ++maxSortOrder,
      });

      // if already added -> skip
      if (this.orderItemRows.some(oi => oi.product.id === pr.id)) continue;

      this.orderItemRows = [...this.orderItemRows, row];
    }

    if (!this.periods.length && periodModel) {
      this.periods = [periodModel];
    }

    this.checkOrderProductsStatuses();
  };

  removeOrderItemRows = (ids: number[]): void => {
    this.orderItemRows = this.orderItemRows.filter(row => !ids.includes(row.id));
  };

  getOrderItemRow = (id: number): RentalOrderItemRow => {
    const orderItemRow = this.orderItemRows.find(r => r.id === id);

    if (!orderItemRow) {
      throw new Error(`Rental order item row with id ${id} not found`);
    }

    return orderItemRow;
  };

  // @ts-ignore
  onCurrencyChange = (_currency: Currency): void => {
    // this logic is currently not used, in case of need of implementation
    // check OrderStore onCurrencyChange method
  };

  createOrder = async (entityId: number): Promise<RentalOrder> => {
    this.orderJsonState = null;

    try {
      this.orderCreating = true;

      const dto = new CreateRentalOrderDto({
        warehouseId: this.getCurrentWarehouseId(),
        entityId,
        status: this.getInitialOrderStatus(),
        periods: DatePeriodDto.fromUtcDatesRangeValueModels(this.getValidPeriods()),
        items: RentalOrderItemDto.fromOrderItemRows(this.orderItemRows),
        currency: this.currentCurrency.value as Currency,
        taxIncluded: this.taxStrategy.value === TaxStrategy.INCLUDED,
      });

      return await productRentalOrderApi.createEntityRentalProductOrder({
        sectionId: this.productsSection.id,
        dto,
      });
    } catch (e) {
      throw new Error(`Error while creating order: ${e}`);
    } finally {
      this.orderCreating = false;
    }
  };

  updateOrder = async (orderId: number): Promise<RentalOrder> => {
    try {
      this.orderUpdating = true;

      const dto = new UpdateRentalOrderDto({
        status: this.getCurrentOrderStatus(),
        periods: DatePeriodDto.fromUtcDatesRangeValueModels(this.getValidPeriods()),
        items: UpdateRentalOrderItemDto.fromOrderItemRows(this.orderItemRows),
        currency: this.currentCurrency.value,
        taxIncluded: this.taxStrategy.value === TaxStrategy.INCLUDED,
        warehouseId: this.getCurrentWarehouseId(),
      });

      const updatedOrder = await productRentalOrderApi.updateEntityRentalProductOrder({
        sectionId: this.productsSection.id,
        orderId,
        dto,
      });

      await this.loadProducts(updatedOrder.items.map<number>(oi => oi.productId));

      this.invalidateProductRows();
      this.initializeOrderData(updatedOrder);

      return updatedOrder;
    } catch (e) {
      throw new Error(`Error while updating order: ${e}`);
    } finally {
      this.orderUpdating = false;
    }
  };

  save = async (setIdToParam: boolean = true): Promise<void> => {
    if (!validateForm(this.orderItemRows)) return;

    if (this.order) {
      await this.updateOrder(this.order.id);
    } else {
      const { id } = await this.createOrder(this.entityId);

      if (setIdToParam) this.setOrderIdParam(id);
    }

    invalidateEntityRentalProductOrdersInCache({
      entityId: this.entityId,
      sectionId: this.productsSection.id,
    });
    invalidateGetProductsQuery(this.productsSection.id);
  };

  @computed.struct
  totalAmount = (): number => {
    const taxIncluded = this.taxStrategy.value === TaxStrategy.INCLUDED;

    return this.orderItemRows.reduce<number>(
      (total, curr) => total + curr.getAmount(taxIncluded, this.totalRentingDays),
      0
    );
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

  checkOrderProductsStatuses = async (): Promise<void> => {
    try {
      this.productStatusesUpdating = true;

      if (!this.orderItemRows.length || !this.hasValidPeriods()) {
        return;
      }

      const dto = new CheckRentalStatusDto({
        productIds: this.orderItemRows.map<number>(oi => oi.product.id),
        periods: DatePeriodDto.fromUtcDatesRangeValueModels(this.getValidPeriods()),
      });

      const productRentalStatuses =
        await productRentalOrderApi.checkRentalProductsAvailabilityStatus({
          sectionId: this.productsSection.id,
          dto,
        });

      // update product rental statuses
      this.orderItemRows = this.orderItemRows.map(oi => {
        const productRentalStatus = productRentalStatuses.find(s => s.productId === oi.product.id);

        if (productRentalStatus) {
          oi.product.rentalStatus = productRentalStatus.rentalStatus;
        }

        return oi;
      });
    } catch (e) {
      throw new Error(`Error while checking order products statuses: ${e}`);
    } finally {
      this.productStatusesUpdating = false;
    }
  };

  wasProductRowAlreadyAdded = (productRowId: number): boolean => {
    return this.orderItemRows.some(oi => oi.product.id === productRowId);
  };

  hasAvailableProducts = (): boolean => {
    return this.productRows.some(pr => !this.wasProductRowAlreadyAdded(pr.id));
  };

  @computed.struct
  allOrderItemsAreAvailable = (): boolean => {
    if (this.orderId) {
      const newlyAddedOrderItemRows = this.orderItemRows.filter(oi => oi.id < 0);

      return newlyAddedOrderItemRows.every(
        oi => oi.product.rentalStatus === RentalStatus.AVAILABLE
      );
    }

    return this.orderItemRows.every(oi => oi.product.rentalStatus === RentalStatus.AVAILABLE);
  };
}
