import { ORDER_NEW_PARAM_VALUE } from '@/modules/card';
import {
  ChangesUnsavedBlocker,
  MyDatePickerSelect,
  type Nullable,
  type SelectModel,
  type ToggleControl,
} from '@/shared';
import type { IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  RentalOrderStatus,
  type OrderBlockComponentProps,
  type ProductWarehouseBlockTemplateHeaderProps,
} from '../../../../shared';
import { RentalOrderStore } from '../../../../store';
import { ProductsOrderPanelsTemplate } from '../../../../templates';
import {
  CardRentalProductsOrderBlock,
  CardRentalProductsWarehouseBlock,
  type CardRentalProductsOrderBlockHeaderProps,
} from './components';

interface Props extends OrderBlockComponentProps {
  productsIntervalControl: ToggleControl;
  productsIntervalModel: SelectModel;
}

const CardRentalProductsOrderComponent = observer((props: Props) => {
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
    productsIntervalControl,
    productsIntervalModel,
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

  const parsedOrderId: Nullable<number> =
    orderId === ORDER_NEW_PARAM_VALUE ? null : Number(orderId);

  const orderStore = useMemo(
    () =>
      new RentalOrderStore({
        entityId,
        productsSection,
        orderId: parsedOrderId,
        setOrderIdParam,
      }),
    [productsSection, entityId, parsedOrderId, setOrderIdParam]
  );

  const { orderItemRows, orderLoaded, getCurrentWarehouseId, setCurrentWarehouseId } = orderStore;

  const orderWarehouseReactionDisposer = useRef<IReactionDisposer>(null);
  const periodsReactionDisposer = useRef<IReactionDisposer>(null);

  useEffect(() => {
    orderStore.initializeOrderData();
  }, [orderStore]);

  useEffect(() => {
    if (warehousesEnabled) {
      const firstWarehouse = accessibleWarehouses[0];
      // if there is only one warehouse, we select it by default
      if (firstWarehouse && accessibleWarehouses.length === 1)
        orderStore.currentWarehouse.value = firstWarehouse.id;

      orderWarehouseReactionDisposer.current = orderStore.filterOrderItemRowsByWarehouse();
    }

    periodsReactionDisposer.current = orderStore.updateOrderProductsRentalStatuses();

    return () => {
      orderWarehouseReactionDisposer.current?.();
      periodsReactionDisposer.current?.();
    };
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
    if (productsResult) orderStore.setProductRows(productsResult.products);
  }, [accessibleWarehouses, orderStore, productsResult]);

  const handleSelectOrderWarehouse = useCallback(
    (orderWarehouseId: Nullable<number>) => {
      setCurrentWarehouseId(orderWarehouseId);

      setCurrentPage(1);
    },
    [setCurrentWarehouseId, setCurrentPage]
  );

  const canEditPeriods = orderStore.orderId
    ? orderStore.currentStatus.value === RentalOrderStatus.FORMED
    : true;

  const orderHeaderProps = useMemo<CardRentalProductsOrderBlockHeaderProps>(
    () => ({
      disabled: !canEditOrder,
      rentalOrderPeriodsControlProps: {
        periods: orderStore.periods,
        disabled: !canEditPeriods,
      },
      warehouseSelectProps:
        warehousesEnabled && warehouseStore.accessibleWarehouses.length > 0
          ? {
              warehouseStore,
              model: currentWarehouseId,
              clearable: accessibleWarehouses.length >= 1,
              hidden: !warehousesEnabled || !accessibleWarehouses.length,
              handleChange: handleSelectOrderWarehouse,
            }
          : undefined,
      statusesSelectProps: {
        visible: orderItemRows.length > 0,
        model: orderStore.currentStatus,
      },
    }),
    [
      canEditOrder,
      canEditPeriods,
      warehouseStore,
      warehousesEnabled,
      orderStore.periods,
      currentWarehouseId,
      accessibleWarehouses,
      orderItemRows.length,
      orderStore.currentStatus,
      handleSelectOrderWarehouse,
    ]
  );

  const warehouseHeaderProps = useMemo<ProductWarehouseBlockTemplateHeaderProps>(
    () => ({
      ExtraControls: (
        <MyDatePickerSelect
          clearable
          type="range"
          variant="outlined"
          titleWidth="224px"
          model={productsIntervalModel}
          opened={productsIntervalControl.active}
          show={productsIntervalControl.open}
          hide={productsIntervalControl.close}
        />
      ),
      searchBlockProps: {
        searchModel,
        onChange: debouncedSearchQuery,
        onClear: handleClearSearchQuery,
      },
      categorySelectProps: {
        productCategoryStore,
        model: filterCategoryId,
        handleChange: handleSelectFilterCategory,
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
      productsIntervalModel,
      productsIntervalControl,
      debouncedSearchQuery,
      handleClearSearchQuery,
      handleSelectFilterCategory,
      handleSelectFilterWarehouse,
    ]
  );

  return (
    <>
      <ChangesUnsavedBlocker
        shouldBlock={orderStore.isJsonStateChanged()}
        handleSaveChanges={() => orderStore.save(false)}
      />

      <ProductsOrderPanelsTemplate
        entityTypeId={entity.entityTypeId}
        warehouseBlockVisible={orderLoaded}
        OrderBlock={
          <CardRentalProductsOrderBlock
            orderStore={orderStore}
            entityName={entity.name}
            canEditOrder={canEditOrder}
            headerProps={orderHeaderProps}
            entityTypeId={entity.entityTypeId}
          />
        }
        WarehouseBlock={
          <CardRentalProductsWarehouseBlock
            orderStore={orderStore}
            currentPage={currentPage}
            canCreateOrder={canCreateOrder}
            warehouseStore={warehouseStore}
            productsLoading={productsLoading}
            headerProps={warehouseHeaderProps}
            filterWarehouseId={filterWarehouseId}
            warehousesEnabled={warehousesEnabled}
            productsResultMeta={productsResult?.meta}
            productCategoryStore={productCategoryStore}
            productsIntervalModel={productsIntervalModel}
            showingPreviousData={showingPreviousProductsData}
            handleChangePage={setCurrentPage}
            initializeProductRows={
              productsResult ? () => orderStore.setProductRows(productsResult.products) : undefined
            }
          />
        }
      />
    </>
  );
});

CardRentalProductsOrderBlock.displayName = 'CardRentalProductsOrderBlock';
export { CardRentalProductsOrderComponent };
