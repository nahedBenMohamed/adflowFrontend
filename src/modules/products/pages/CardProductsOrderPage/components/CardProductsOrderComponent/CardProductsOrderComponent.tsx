import { ORDER_NEW_PARAM_VALUE } from '@/modules/card';
import { ChangesUnsavedBlocker, type Nullable, type Optional } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  OrderStatusCode,
  type OrderBlockComponentProps,
  type ProductWarehouseBlockTemplateHeaderProps,
} from '../../../../shared';
import { OrderStore, orderStatusStore } from '../../../../store';
import { ProductsOrderPanelsTemplate } from '../../../../templates';
import {
  CardProductsOrderBlock,
  CardProductsWarehouseBlock,
  ReturnOrderStocksWarningModal,
} from '../CardProductsOrderComponent/components';
import type { CardOrderBlockHeaderProps } from './components';

const CardProductsOrderComponent = observer((props: OrderBlockComponentProps) => {
  const {
    productsSection,
    orderId,
    productCategoryStore,
    warehouseStore,
    entity,
    mutationRights: { canCreateOrder, canEditOrder },
    currentPage,
    productsResult,
    productsLoading,
    showingPreviousProductsData,
    warehousesEnabled,
    lastSelectedWarehouseSettings,
    filterProps: {
      searchModel,
      filterWarehouseId,
      filterCategoryId,
      handleClearSearchQuery,
      debouncedSearchQuery,
      setFilterWarehouseId,
      handleSelectFilterCategory,
      handleSelectFilterWarehouse,
    },
    setCurrentPage,
    setOrderIdParam,
  } = props;

  const { accessibleWarehouses } = warehouseStore;
  const entityId = entity.id;

  const [
    returnOrderStocksWarningModalOpened,
    { open: showReturnOrderStocksWarningModal, close: hideReturnOrderStocksWarningModal },
  ] = useDisclosure(false);

  const parsedOrderId: Nullable<number> =
    orderId === ORDER_NEW_PARAM_VALUE ? null : Number(orderId);

  const orderStore = useMemo(
    () =>
      new OrderStore({
        entityId,
        productsSection,
        warehousesEnabled,
        orderId: parsedOrderId,
        setOrderIdParam,
      }),
    [entityId, parsedOrderId, productsSection, warehousesEnabled, setOrderIdParam]
  );

  const {
    order,
    cancelAfter,
    orderItemRows,
    currentStatus,
    currentWarehouse,
    orderLoaded,
    orderDataInitializing,
    setCancelAfter,
    getCurrentWarehouseId,
  } = orderStore;

  const loadedAndInitialized = orderLoaded && !orderDataInitializing;

  useEffect(() => {
    orderStore.initializeOrderData();
  }, [orderStore]);

  const orderWarehouseReactionDisposer = useRef<IReactionDisposer>(null);

  useEffect(() => {
    if (warehousesEnabled && accessibleWarehouses[0]) {
      // if there is only one warehouse, we select it by default
      if (accessibleWarehouses.length === 1)
        orderStore.currentWarehouse.value = accessibleWarehouses[0].id;

      orderWarehouseReactionDisposer.current = orderStore.filterOrderItemRowsByWarehouse();
    }

    return () => orderWarehouseReactionDisposer.current?.();
  }, [orderStore, entityId, accessibleWarehouses, warehousesEnabled]);

  const currentWarehouseId = getCurrentWarehouseId();

  useEffect(() => {
    if (currentWarehouseId && warehousesEnabled) setFilterWarehouseId(currentWarehouseId);
  }, [currentWarehouseId, warehousesEnabled, setFilterWarehouseId]);

  useLayoutEffect(() => {
    if (lastSelectedWarehouseSettings?.warehouseId && !orderId)
      orderStore.setCurrentWarehouseId(lastSelectedWarehouseSettings.warehouseId);
  }, [lastSelectedWarehouseSettings, orderStore, orderId]);

  useLayoutEffect(() => {
    if (productsResult)
      orderStore.setProductRows({
        warehouses: accessibleWarehouses,
        products: productsResult.products,
      });
  }, [accessibleWarehouses, orderStore, productsResult]);

  const handleSelectOrderWarehouse = useCallback(
    (orderWarehouseId: Nullable<number>) => {
      currentWarehouse.setValue(orderWarehouseId);

      setCurrentPage(1);
    },
    [currentWarehouse, setCurrentPage]
  );

  const currentOrderStatusCode = order?.statusId
    ? orderStatusStore.getById(order.statusId).code
    : null;

  const reservedOrNotInitialized =
    !currentOrderStatusCode || currentOrderStatusCode === OrderStatusCode.RESERVED;

  const orderHeaderProps = useMemo<CardOrderBlockHeaderProps>(
    () => ({
      disabled: !canEditOrder,
      cancelAfterSelectProps: {
        cancelAfter,
        visible:
          warehousesEnabled &&
          accessibleWarehouses.length > 0 &&
          (currentOrderStatusCode === OrderStatusCode.RESERVED || !currentOrderStatusCode),
        onChange: setCancelAfter,
      },
      statusesSelectProps: warehousesEnabled
        ? {
            model: currentStatus,
            visible: orderItemRows.length > 0,
            statuses: orderStatusStore.getOrderAvailableStatuses(currentStatus.value ?? null),
          }
        : undefined,
      warehouseSelectProps: warehousesEnabled
        ? {
            warehouseStore,
            model: currentWarehouseId,
            disabled: !reservedOrNotInitialized,
            clearable: accessibleWarehouses.length >= 1,
            hidden: !warehousesEnabled || !accessibleWarehouses.length,
            handleChange: handleSelectOrderWarehouse,
          }
        : undefined,
    }),
    [
      cancelAfter,
      canEditOrder,
      currentStatus,
      orderItemRows,
      warehouseStore,
      warehousesEnabled,
      currentWarehouseId,
      accessibleWarehouses,
      currentOrderStatusCode,
      reservedOrNotInitialized,
      setCancelAfter,
      handleSelectOrderWarehouse,
    ]
  );

  const warehouseHeaderProps = useMemo<ProductWarehouseBlockTemplateHeaderProps>(
    () => ({
      searchBlockProps: {
        searchModel,
        onChange: debouncedSearchQuery,
        onClear: handleClearSearchQuery,
      },
      categorySelectProps: {
        productCategoryStore,
        model: filterCategoryId,
        onChange: handleSelectFilterCategory,
      },
      warehouseSelectProps: {
        warehouseStore,
        model: filterWarehouseId,
        disabled: Boolean(currentWarehouseId),
        clearable: !currentWarehouseId && Boolean(filterWarehouseId),
        handleChange: handleSelectFilterWarehouse,
      },
    }),
    [
      searchModel,
      warehouseStore,
      filterCategoryId,
      filterWarehouseId,
      currentWarehouseId,
      productCategoryStore,
      debouncedSearchQuery,
      handleClearSearchQuery,
      handleSelectFilterWarehouse,
      handleSelectFilterCategory,
    ]
  );

  const getInitializeProductRowsHandler = useCallback<() => Optional<() => void>>(
    () =>
      productsResult
        ? () =>
            orderStore.setProductRows({
              warehouses: accessibleWarehouses,
              products: productsResult.products,
            })
        : undefined,
    [orderStore, accessibleWarehouses, productsResult]
  );

  // we show return order stocks warning modal when user is trying to change order status to RETURNED,
  // or when user is trying to cancel order that is already SHIPPED
  const returnStocksWarningCondition = useMemo<boolean>(() => {
    if (orderItemRows.every(r => r.product.isService())) return false;

    const newStatusCode = currentStatus.value
      ? orderStatusStore.getById(currentStatus.value).code
      : null;

    const oldStatusCode = order?.statusId ? orderStatusStore.getById(order.statusId).code : null;

    // show return stocks warning modal when user is trying to change order status to RETURNED or CANCELLED,
    // and current (old) order status was SHIPPED
    return Boolean(
      newStatusCode &&
        [OrderStatusCode.CANCELLED, OrderStatusCode.RETURNED].includes(newStatusCode) &&
        oldStatusCode === OrderStatusCode.SHIPPED
    );
  }, [orderItemRows, currentStatus.value, order?.statusId]);

  const handleShowReturnOrderStocksWarningModal = useCallback(async (): Promise<void> => {
    if (returnStocksWarningCondition) {
      showReturnOrderStocksWarningModal();
    } else {
      await orderStore.save({ setIdToParam: true });
    }
  }, [returnStocksWarningCondition, orderStore, showReturnOrderStocksWarningModal]);

  return (
    <>
      <ChangesUnsavedBlocker
        shouldBlock={orderStore.isJsonStateChanged()}
        showCustomWarningOnBlocked={
          returnStocksWarningCondition ? showReturnOrderStocksWarningModal : undefined
        }
        handleSaveChanges={() => orderStore.save({ setIdToParam: false })}
      />

      <ProductsOrderPanelsTemplate
        entityTypeId={entity.entityTypeId}
        // We do not allow to modify order items when it's moved to any other status than RESERVED
        warehouseBlockVisible={
          (!currentOrderStatusCode || currentOrderStatusCode === OrderStatusCode.RESERVED) &&
          loadedAndInitialized
        }
        OrderBlock={
          <CardProductsOrderBlock
            orderStore={orderStore}
            entityName={entity.name}
            canEditOrder={canEditOrder}
            headerProps={orderHeaderProps}
            warehouseStore={warehouseStore}
            entityTypeId={entity.entityTypeId}
            currentOrderStatusCode={currentOrderStatusCode}
            reservedOrNotInitialized={reservedOrNotInitialized}
            handleSaveOrder={handleShowReturnOrderStocksWarningModal}
          />
        }
        WarehouseBlock={
          <CardProductsWarehouseBlock
            orderStore={orderStore}
            currentPage={currentPage}
            canCreateOrder={canCreateOrder}
            warehouseStore={warehouseStore}
            productsLoading={productsLoading}
            headerProps={warehouseHeaderProps}
            filterWarehouseId={filterWarehouseId}
            productsResultMeta={productsResult?.meta}
            productCategoryStore={productCategoryStore}
            showingPreviousData={showingPreviousProductsData}
            handleChangePage={setCurrentPage}
            initializeProductRows={getInitializeProductRowsHandler()}
          />
        }
      />

      {parsedOrderId && returnOrderStocksWarningModalOpened && (
        <ReturnOrderStocksWarningModal
          entityId={entityId}
          orderId={parsedOrderId}
          sectionId={productsSection.id}
          entityTypeId={entity.entityTypeId}
          opened={returnOrderStocksWarningModalOpened}
          onClose={hideReturnOrderStocksWarningModal}
          onApprove={returnStocks => orderStore.save({ setIdToParam: true, returnStocks })}
        />
      )}
    </>
  );
});

CardProductsOrderComponent.displayName = 'CardProductsOrderComponent';
export { CardProductsOrderComponent };
