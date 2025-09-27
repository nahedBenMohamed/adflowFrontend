import { authStore } from '@/modules/auth';
import { PermissionObjectType } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useRentalCardOrderColumns, type RentalOrderItemRow } from '../../../../../../shared';
import type { RentalOrderStore } from '../../../../../../store';
import {
  ProductsOrderBlockTemplate,
  type ProductsOrderBlockTemplateButtonsState,
} from '../../../../../../templates';
import {
  CardRentalProductsOrderBlockHeader,
  DeleteRentalOrderOrClearItemsWarningModal,
  DeleteRentalOrderWarningModal,
  RentalCardProductsOrderTable,
  type CardRentalProductsOrderBlockHeaderProps,
} from './components';

interface Props {
  entityName: string;
  entityTypeId: number;
  canEditOrder: boolean;
  orderStore: RentalOrderStore;
  headerProps: CardRentalProductsOrderBlockHeaderProps;
}

const CardRentalProductsOrderBlock = observer((props: Props) => {
  const { entityName, entityTypeId, canEditOrder, orderStore, headerProps } = props;

  const {
    order,
    orderId,
    entityId,
    orderLoaded,
    orderItemRows,
    orderCreating,
    orderUpdating,
    productsSection,
    orderDataInitializing,
    productStatusesUpdating,
    hasValidPeriods,
    isJsonStateChanged,
    save: handleSaveOrder,
    allOrderItemsAreAvailable,
    cancelChanges: handleCancelChanges,
    removeOrderItemRows: removeSelected,
  } = orderStore;

  const { user: currentUser } = authStore;

  const canDeleteOrder = currentUser
    ? orderId
      ? currentUser.canDelete(PermissionObjectType.PRODUCTS_ORDER, orderId)
      : false
    : false;

  const [
    deleteRentalOrderWarningModalOpened,
    { open: showDeleteRentalOrderWarningModal, close: hideDeleteRentalOrderWarningModal },
  ] = useDisclosure(false);

  const [
    deleteRentalOrderOrClearItemsWarningModalOpened,
    {
      open: showDeleteRentalOrderOrClearItemsWarningModal,
      close: hideDeleteRentalOrderOrClearItemsWarningModal,
    },
  ] = useDisclosure(false);

  const sortedOrderItemRows = orderStore.sortedOrderItemRows;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedIds = useMemo<number[]>(
    () =>
      Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(Number),
    [rowSelection]
  );

  const handleRemoveSelected = useCallback(() => {
    // when we're trying to remove last row using clear action button
    removeSelected(orderItemRows.length === 1 ? orderItemRows.map(row => row.id) : selectedIds);

    hideDeleteRentalOrderOrClearItemsWarningModal();
  }, [selectedIds, orderItemRows, removeSelected, hideDeleteRentalOrderOrClearItemsWarningModal]);

  const columns = useRentalCardOrderColumns({
    orderStore,
    showDeleteRentalOrderOrClearItemsWarningModal,
  });

  const rentalCardOrderTable = useReactTable<RentalOrderItemRow>({
    columns,
    enableRowSelection: true,
    data: sortedOrderItemRows,
    state: {
      rowSelection,
    },
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  const stateChanged = isJsonStateChanged();

  const creatingOrUpdating = orderCreating || orderUpdating;
  const showSkeleton = orderId ? !orderLoaded || orderDataInitializing : false;

  const controlButtonDisabled =
    creatingOrUpdating || showSkeleton || !sortedOrderItemRows.length || !stateChanged;

  const buttonState = useMemo<ProductsOrderBlockTemplateButtonsState>(
    () => ({
      approve: {
        loading: creatingOrUpdating,
        disabled: controlButtonDisabled || !hasValidPeriods() || !allOrderItemsAreAvailable(),
      },
      cancel: {
        disabled: (orderItemRows.length > 0 || !orderId) && controlButtonDisabled,
      },
    }),
    [
      orderId,
      orderItemRows,
      creatingOrUpdating,
      controlButtonDisabled,
      hasValidPeriods,
      allOrderItemsAreAvailable,
    ]
  );

  const handleRemoveSelectedOrShowWarning = useCallback(
    () =>
      selectedIds.length > 0 && orderId && selectedIds.length === orderItemRows.length
        ? showDeleteRentalOrderOrClearItemsWarningModal()
        : handleRemoveSelected(),
    [
      orderId,
      selectedIds,
      orderItemRows.length,
      handleRemoveSelected,
      showDeleteRentalOrderOrClearItemsWarningModal,
    ]
  );

  const OrderHeader = useMemo<ReactNode>(
    () => (
      <CardRentalProductsOrderBlockHeader
        {...headerProps}
        onDelete={canDeleteOrder ? showDeleteRentalOrderWarningModal : undefined}
      />
    ),
    [canDeleteOrder, headerProps, showDeleteRentalOrderWarningModal]
  );

  const OrderTable = useMemo<ReactNode>(
    () => (
      <RentalCardProductsOrderTable
        disabled={!canEditOrder}
        loading={productStatusesUpdating}
        rentalCardOrderTable={rentalCardOrderTable}
      />
      // we memoize RentalCardProductsOrderTable to prevent excess renders when modifying order items,
      // but for it to be reactive we need to include some extra dependencies, like:
      // * sortedOrderItemRows -> to ensure that table will be re-rendered when order items are changed (added, removed, etc.)
      // * rowSelection -> to ensure that table will be re-rendered when row selection is changed (checkboxes are checked/unchecked)
    ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canEditOrder, rentalCardOrderTable, sortedOrderItemRows, rowSelection]
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
          {deleteRentalOrderWarningModalOpened && (
            <DeleteRentalOrderWarningModal
              orderId={orderId}
              entityId={entityId}
              entityTypeId={entityTypeId}
              sectionId={productsSection.id}
              opened={deleteRentalOrderWarningModalOpened}
              onClose={hideDeleteRentalOrderWarningModal}
            />
          )}

          {/* When user selected all order items and trying to delete them we give him a choice –
              whether he wants to delete the entire order or just selected items */}
          {deleteRentalOrderOrClearItemsWarningModalOpened && (
            <DeleteRentalOrderOrClearItemsWarningModal
              orderId={orderId}
              entityId={entityId}
              entityTypeId={entityTypeId}
              sectionId={productsSection.id}
              opened={deleteRentalOrderOrClearItemsWarningModalOpened}
              onCancel={handleRemoveSelected}
              onClose={hideDeleteRentalOrderOrClearItemsWarningModal}
            />
          )}
        </>
      )}
    </>
  );
});

CardRentalProductsOrderBlock.displayName = 'CardRentalProductsOrderBlock';
export { CardRentalProductsOrderBlock };
