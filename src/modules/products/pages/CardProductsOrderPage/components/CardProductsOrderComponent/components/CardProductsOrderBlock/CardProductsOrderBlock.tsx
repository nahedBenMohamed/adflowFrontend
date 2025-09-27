import { authStore } from '@/modules/auth';
import { PermissionObjectType, type Nullable, type Optional } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import {
  CardOrderColumnsIds,
  OrderStatusCode,
  useCardOrderColumns,
  type OrderItemRow,
} from '../../../../../../shared';
import type { OrderStore, WarehouseStore } from '../../../../../../store';
import {
  ProductsOrderBlockTemplate,
  type ProductsOrderBlockTemplateButtonsState,
} from '../../../../../../templates';
import {
  CardProductsOrderBlockHeader,
  CardProductsOrderTable,
  DeleteOrderOrClearItemsWarningModal,
  DeleteOrderWarningModal,
  ReturnOrderStocksWarningModal,
  type CardOrderBlockHeaderProps,
} from './components';

interface Props {
  entityName: string;
  entityTypeId: number;
  canEditOrder: boolean;
  orderStore: OrderStore;
  warehouseStore: WarehouseStore;
  headerProps: CardOrderBlockHeaderProps;
  reservedOrNotInitialized: boolean;
  currentOrderStatusCode: Nullable<OrderStatusCode>;
  handleSaveOrder: () => void;
}

const CardProductsOrderBlock = observer((props: Props) => {
  const {
    entityName,
    entityTypeId,
    canEditOrder,
    orderStore,
    warehouseStore,
    headerProps,
    reservedOrNotInitialized,
    currentOrderStatusCode,
    handleSaveOrder,
  } = props;

  const {
    order,
    orderId,
    entityId,
    productsSection,
    orderItemRows,
    orderCreating,
    orderUpdating,
    orderLoaded,
    orderDataInitializing,
    cancelChanges: handleCancelChanges,
    removeOrderItemRows: removeSelected,
    isJsonStateChanged,
  } = orderStore;

  const { user: currentUser } = authStore;

  const [
    deleteOrderWarningModalOpened,
    { open: showDeleteOrderWarningModal, close: hideDeleteOrderWarningModal },
  ] = useDisclosure(false);

  const [
    deleteOrderOrClearItemsWarningModalOpened,
    {
      open: showDeleteOrderOrClearItemsWarningModal,
      close: hideDeleteOrderOrClearItemsWarningModal,
    },
  ] = useDisclosure(false);

  const [
    returnOrderStocksWarningModalOpened,
    { open: showReturnOrderStocksWarningModal, close: hideReturnOrderStocksWarningModal },
  ] = useDisclosure(false);

  const { warehousesEnabled, sortedOrderItemRows } = orderStore;

  const canDeleteOrder = currentUser
    ? orderId
      ? currentUser.canDelete(PermissionObjectType.PRODUCTS_ORDER, orderId)
      : false
    : false;

  const columns = useCardOrderColumns({
    orderStore,
    warehouseStore,
    reservedOrNotInitialized,
    showDeleteOrderOrClearItemsWarningModal,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const cardOrderTable = useReactTable<OrderItemRow>({
    columns,
    enableRowSelection: true,
    data: sortedOrderItemRows,
    state: {
      rowSelection,
      columnVisibility,
    },
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  useLayoutEffect(() => {
    when(
      () => !warehousesEnabled,
      () => {
        cardOrderTable.getAllColumns().forEach(c => {
          if (c.id === CardOrderColumnsIds.AVAILABLE && c.getIsVisible()) c.toggleVisibility();
        });
      }
    );
  }, [warehousesEnabled, cardOrderTable]);

  const selectedIds = useMemo<number[]>(
    () =>
      Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(Number),
    [rowSelection]
  );

  const showReturnOrderStocksModalCondition = useMemo<boolean>(
    () =>
      currentOrderStatusCode === OrderStatusCode.SHIPPED &&
      !orderItemRows.every(row => row.product.isService()),
    [orderItemRows, currentOrderStatusCode]
  );

  const handleApproveDelete = useMemo<Optional<() => void>>(
    () =>
      showReturnOrderStocksModalCondition
        ? () => {
            showReturnOrderStocksWarningModal();

            hideDeleteOrderWarningModal();
          }
        : undefined,
    [
      showReturnOrderStocksModalCondition,
      showReturnOrderStocksWarningModal,
      hideDeleteOrderWarningModal,
    ]
  );

  const handleApproveDeleteOrClearItems = useMemo<Optional<() => void>>(
    () =>
      showReturnOrderStocksModalCondition
        ? () => {
            showReturnOrderStocksWarningModal();

            hideDeleteOrderOrClearItemsWarningModal();
          }
        : undefined,
    [
      showReturnOrderStocksModalCondition,
      showReturnOrderStocksWarningModal,
      hideDeleteOrderOrClearItemsWarningModal,
    ]
  );

  const handleRemoveSelected = useCallback(() => {
    // when we're trying to remove last row using clear action button
    removeSelected(orderItemRows.length === 1 ? orderItemRows.map<number>(r => r.id) : selectedIds);

    cardOrderTable.resetRowSelection();

    hideDeleteOrderOrClearItemsWarningModal();
  }, [
    selectedIds,
    orderItemRows,
    cardOrderTable,
    removeSelected,
    hideDeleteOrderOrClearItemsWarningModal,
  ]);

  const stateChanged = isJsonStateChanged();

  const creatingOrUpdating = orderCreating || orderUpdating;
  const showSkeleton = orderId ? !orderLoaded || orderDataInitializing : false;

  const controlButtonDisabled =
    creatingOrUpdating || showSkeleton || !sortedOrderItemRows.length || !stateChanged;

  const buttonState = useMemo<ProductsOrderBlockTemplateButtonsState>(
    () => ({
      approve: {
        loading: creatingOrUpdating,
        disabled: controlButtonDisabled,
      },
      cancel: {
        disabled: (orderItemRows.length > 0 || !orderId) && controlButtonDisabled,
      },
    }),
    [creatingOrUpdating, controlButtonDisabled, orderItemRows.length, orderId]
  );

  const handleRemoveSelectedOrShowWarning = useCallback<() => void>(
    () =>
      selectedIds.length > 0 && orderId && selectedIds.length === orderItemRows.length
        ? canDeleteOrder
          ? showDeleteOrderOrClearItemsWarningModal()
          : handleRemoveSelected()
        : handleRemoveSelected(),
    [
      orderId,
      selectedIds,
      canDeleteOrder,
      orderItemRows.length,
      handleRemoveSelected,
      showDeleteOrderOrClearItemsWarningModal,
    ]
  );

  const OrderHeader = useMemo<ReactNode>(
    () => (
      <CardProductsOrderBlockHeader
        {...headerProps}
        onDelete={canDeleteOrder ? showDeleteOrderWarningModal : undefined}
      />
    ),
    [headerProps, canDeleteOrder, showDeleteOrderWarningModal]
  );

  const OrderTable = useMemo<ReactNode>(
    () => <CardProductsOrderTable disabled={!canEditOrder} cardOrderTable={cardOrderTable} />,
    // we memoize CardProductsOrderTable to prevent excess renders when modifying order items,
    // but for it to be reactive we need to include some extra dependencies, like:
    // * sortedOrderItemRows -> to ensure that table will be re-rendered when order items are changed (added, removed, etc.)
    // * rowSelection -> to ensure that table will be re-rendered when row selection is changed (checkboxes are checked/unchecked)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canEditOrder, cardOrderTable, sortedOrderItemRows, rowSelection]
  );

  return (
    <>
      <ProductsOrderBlockTemplate
        Table={OrderTable}
        Header={OrderHeader}
        entityName={entityName}
        buttonsState={buttonState}
        showSkeleton={showSkeleton}
        orderNumber={order?.orderNumber}
        totalAmount={orderStore.totalAmount()}
        showRemoveSelected={selectedIds.length > 0}
        orderItemRowsLength={sortedOrderItemRows.length}
        currentCurrency={orderStore.currentCurrency.value}
        handleSaveOrder={handleSaveOrder}
        handleCancelChanges={handleCancelChanges}
        handleRemoveSelected={handleRemoveSelectedOrShowWarning}
      />

      {orderId && (
        <>
          {/* When we want to delete entire order */}
          {deleteOrderWarningModalOpened && (
            <DeleteOrderWarningModal
              orderId={orderId}
              entityId={entityId}
              entityTypeId={entityTypeId}
              sectionId={productsSection.id}
              opened={deleteOrderWarningModalOpened}
              onApprove={handleApproveDelete}
              onClose={hideDeleteOrderWarningModal}
            />
          )}

          {/* When user selected all order items and trying to delete them we give him a choice –
              whether he wants to delete the entire order or just selected items */}
          {deleteOrderOrClearItemsWarningModalOpened && (
            <DeleteOrderOrClearItemsWarningModal
              orderId={orderId}
              entityId={entityId}
              entityTypeId={entityTypeId}
              sectionId={productsSection.id}
              opened={deleteOrderOrClearItemsWarningModalOpened}
              onCancel={handleRemoveSelected}
              onApprove={handleApproveDeleteOrClearItems}
              onClose={hideDeleteOrderOrClearItemsWarningModal}
            />
          )}

          {/* In some cases we need to ask whether user wants to return stocks or not */}
          {returnOrderStocksWarningModalOpened && (
            <ReturnOrderStocksWarningModal
              orderId={orderId}
              entityId={entityId}
              navigateAfterSuccess
              entityTypeId={entityTypeId}
              sectionId={productsSection.id}
              opened={returnOrderStocksWarningModalOpened}
              onClose={hideReturnOrderStocksWarningModal}
            />
          )}
        </>
      )}
    </>
  );
});

CardProductsOrderBlock.displayName = 'CardProductsOrderBlock';
export { CardProductsOrderBlock };
