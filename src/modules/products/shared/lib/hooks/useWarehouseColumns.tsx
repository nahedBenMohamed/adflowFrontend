import { routes } from '@/app';
import { ActionsHeaderCell, MyCheckbox, SpanWithEllipsis, type Nullable } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { OrderStore, ProductCategoryStore, WarehouseStore } from '../../../store';
import {
  AddProductItemCell,
  NameCell,
  ProductPriceCell,
  QuantityCell,
  QuantityCellWithModal,
  StockCell,
} from '../components';
import { getProductCategoryName } from '../helpers';
import {
  ProductsSectionType,
  WarehouseColumnsIds,
  WarehouseColumnsSizes,
  type ProductRow,
} from '../models';

export const useWarehouseColumns = ({
  orderStore,
  warehouseStore,
  canCreateOrder,
  filterWarehouseId,
  productCategoryStore,
}: {
  orderStore: OrderStore;
  warehouseStore: WarehouseStore;
  canCreateOrder: boolean;
  productCategoryStore: ProductCategoryStore;
  filterWarehouseId: Nullable<number>;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.hooks.use_warehouse_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ProductRow>();

    const currentWarehouseId = orderStore.getCurrentWarehouseId();

    return [
      columnHelper.display({
        id: WarehouseColumnsIds.CHECKBOX,
        size: WarehouseColumnsSizes[WarehouseColumnsIds.CHECKBOX],
        minSize: WarehouseColumnsSizes[WarehouseColumnsIds.CHECKBOX],
        maxSize: WarehouseColumnsSizes[WarehouseColumnsIds.CHECKBOX],
        enableResizing: false,
        header: ({
          table: { getIsAllRowsSelected, getIsSomeRowsSelected, getToggleAllRowsSelectedHandler },
        }) => {
          const hasAvailable = orderStore.warehousesEnabled
            ? orderStore.hasProductWithAvailableStock() && orderStore.hasAvailableProducts()
            : orderStore.hasAvailableProducts();

          return (
            <MyCheckbox
              disabled={!canCreateOrder || !hasAvailable}
              checked={hasAvailable ? getIsAllRowsSelected() : false}
              indeterminate={getIsSomeRowsSelected()}
              onChange={getToggleAllRowsSelectedHandler()}
            />
          );
        },
        cell: info => {
          const { getIsSelected, getToggleSelectedHandler } = info.row;

          const hasAvailable = orderStore.warehousesEnabled
            ? info.row.original.hasAvailable(currentWarehouseId)
            : true;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return (
            <MyCheckbox
              disabled={wasAlreadyAdded ? true : !hasAvailable || !canCreateOrder}
              checked={wasAlreadyAdded ? false : hasAvailable ? getIsSelected() : false}
              onChange={getToggleSelectedHandler()}
            />
          );
        },
      }),

      columnHelper.accessor('product.name', {
        id: WarehouseColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const { product, hasAvailable } = info.row.original;

          const name = info.getValue();
          const { id, sectionId } = product;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(id);

          const inactive = wasAlreadyAdded
            ? true
            : orderStore.warehousesEnabled
              ? !hasAvailable(currentWarehouseId)
              : false;

          return (
            <NameCell
              name={name}
              target="_blank"
              inactive={inactive}
              to={routes.product({
                sectionId,
                sectionType: ProductsSectionType.SALE,
                productId: id,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('product.prices', {
        minSize: WarehouseColumnsSizes.min,
        maxSize: WarehouseColumnsSizes.max,
        header: t('price'),
        cell: info => {
          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          const inactive = wasAlreadyAdded
            ? true
            : orderStore.warehousesEnabled
              ? !info.row.original.hasAvailable(currentWarehouseId)
              : false;

          const prices = info.getValue();

          return <ProductPriceCell inactive={inactive} prices={prices} />;
        },
      }),

      columnHelper.accessor('product.categoryId', {
        minSize: WarehouseColumnsSizes.min,
        maxSize: WarehouseColumnsSizes.max,
        header: t('category'),
        cell: info => {
          const categoryName = getProductCategoryName({
            categoryId: info.getValue(),
            categories: productCategoryStore.categories,
          });

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          const inactive = wasAlreadyAdded
            ? true
            : orderStore.warehousesEnabled
              ? !info.row.original.hasAvailable(currentWarehouseId)
              : false;

          return categoryName ? <SpanWithEllipsis text={categoryName} inactive={inactive} /> : null;
        },
      }),

      columnHelper.display({
        id: WarehouseColumnsIds.AVAILABLE,
        minSize: WarehouseColumnsSizes[WarehouseColumnsIds.AVAILABLE],
        maxSize: WarehouseColumnsSizes[WarehouseColumnsIds.AVAILABLE],
        size: WarehouseColumnsSizes[WarehouseColumnsIds.AVAILABLE],
        header: t('available'),
        cell: info => {
          const { product, getAvailable } = info.row.original;

          const available = getAvailable(currentWarehouseId);

          return product.isService() ? null : (
            <StockCell color={available > 0 ? 'green' : 'red'} stock={available} />
          );
        },
      }),

      columnHelper.accessor('quantity', {
        id: WarehouseColumnsIds.QUANTITY,
        size: WarehouseColumnsSizes[WarehouseColumnsIds.QUANTITY],
        minSize: WarehouseColumnsSizes[WarehouseColumnsIds.QUANTITY],
        maxSize: WarehouseColumnsSizes[WarehouseColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => {
          const productRow = info.row.original;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(productRow.id);

          const inactive = wasAlreadyAdded
            ? true
            : orderStore.warehousesEnabled
              ? !info.row.original.hasAvailable(currentWarehouseId)
              : false;

          if (inactive) return null;

          const { product, maxQuantity, quantity, getQuantity } = productRow;

          if (!orderStore.warehousesEnabled)
            return (
              <QuantityCell
                model={quantity}
                maxQuantity={null}
                orderStore={orderStore}
                filterWarehouseId={null}
              />
            );

          return orderStore.currentWarehouse.value || filterWarehouseId || product.isService() ? (
            <QuantityCell
              model={quantity}
              orderStore={orderStore}
              filterWarehouseId={filterWarehouseId}
              maxQuantity={product.isService() ? null : maxQuantity}
              saveReservations={r =>
                orderStore.saveProductRowReservations({
                  productRowId: productRow.id,
                  reservations: r,
                })
              }
            />
          ) : (
            <QuantityCellWithModal
              row={productRow}
              warehouseStore={warehouseStore}
              sectionType={ProductsSectionType.SALE}
              getQuantity={getQuantity}
              saveReservations={reservations =>
                orderStore.saveProductRowReservations({ productRowId: productRow.id, reservations })
              }
            />
          );
        },
      }),

      columnHelper.display({
        id: WarehouseColumnsIds.ACTIONS,
        maxSize: WarehouseColumnsSizes[WarehouseColumnsIds.ACTIONS],
        minSize: WarehouseColumnsSizes[WarehouseColumnsIds.ACTIONS],
        size: WarehouseColumnsSizes[WarehouseColumnsIds.ACTIONS],
        header: ActionsHeaderCell,
        cell: info => {
          const productRow = info.row.original;
          const { hasAvailable } = productRow;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(productRow.id);

          const disabled = wasAlreadyAdded
            ? true
            : orderStore.warehousesEnabled
              ? !hasAvailable(currentWarehouseId) || !canCreateOrder
              : !canCreateOrder;

          return (
            <AddProductItemCell
              defaultDisabled={disabled}
              quantity={productRow.quantity}
              onAdd={() =>
                orderStore.addOrderItemRows({
                  warehouses: warehouseStore.accessibleWarehouses,
                  productRows: [productRow],
                })
              }
            />
          );
        },
      }),
    ];
  }, [warehouseStore, productCategoryStore, orderStore, filterWarehouseId, canCreateOrder, t]);
};
