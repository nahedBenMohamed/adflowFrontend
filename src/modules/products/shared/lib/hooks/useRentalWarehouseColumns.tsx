import { routes } from '@/app';
import { ActionsHeaderCell, MyCheckbox, SpanWithEllipsis } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductCategoryStore, RentalOrderStore } from '../../../store';
import {
  AddProductItemCell,
  NameCell,
  ProductPriceCell,
  RentalAvailabilityCell,
} from '../components';
import { getProductCategoryName } from '../helpers';
import {
  ProductsSectionType,
  RentalWarehouseColumnsIds,
  RentalWarehouseColumnsSizes,
  type RentalProductRow,
} from '../models';

export const useRentalWarehouseColumns = ({
  orderStore,
  canCreateOrder,
  productCategoryStore,
  handleAddOrderItemRows,
}: {
  orderStore: RentalOrderStore;
  canCreateOrder: boolean;
  productCategoryStore: ProductCategoryStore;
  handleAddOrderItemRows: (productRows: RentalProductRow[]) => void;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_rental_products_order_component.hooks.use_rental_warehouse_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<RentalProductRow>();

    return [
      columnHelper.display({
        id: RentalWarehouseColumnsIds.CHECKBOX,
        size: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.CHECKBOX],
        minSize: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.CHECKBOX],
        maxSize: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.CHECKBOX],
        enableResizing: false,
        header: ({
          table: { getIsAllRowsSelected, getIsSomeRowsSelected, getToggleAllRowsSelectedHandler },
        }) => {
          const hasAvailable = orderStore.hasAvailableProducts();

          return (
            <MyCheckbox
              indeterminate={getIsSomeRowsSelected()}
              disabled={!canCreateOrder || !hasAvailable}
              checked={hasAvailable ? getIsAllRowsSelected() : false}
              onChange={getToggleAllRowsSelectedHandler()}
            />
          );
        },
        cell: info => {
          const { getIsSelected, getToggleSelectedHandler } = info.row;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return (
            <MyCheckbox
              disabled={!canCreateOrder || wasAlreadyAdded}
              checked={wasAlreadyAdded ? false : getIsSelected()}
              onChange={getToggleSelectedHandler()}
            />
          );
        },
      }),

      columnHelper.accessor('product.name', {
        id: RentalWarehouseColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const { product } = info.row.original;

          const name = info.getValue();
          const { id, sectionId } = product;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return (
            <NameCell
              name={name}
              target="_blank"
              inactive={wasAlreadyAdded}
              to={routes.product({
                sectionId,
                sectionType: ProductsSectionType.RENTAL,
                productId: id,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('product.prices', {
        minSize: RentalWarehouseColumnsSizes.min,
        maxSize: RentalWarehouseColumnsSizes.max,
        header: t('price'),
        cell: info => {
          const prices = info.getValue();

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return <ProductPriceCell inactive={wasAlreadyAdded} prices={prices} />;
        },
      }),

      columnHelper.accessor('product.categoryId', {
        minSize: RentalWarehouseColumnsSizes.min,
        maxSize: RentalWarehouseColumnsSizes.max,
        header: t('category'),
        cell: info => {
          const categoryName = getProductCategoryName({
            categoryId: info.getValue(),
            categories: productCategoryStore.categories,
          });

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return categoryName ? (
            <SpanWithEllipsis inactive={wasAlreadyAdded} text={categoryName} />
          ) : null;
        },
      }),

      columnHelper.accessor('product.rentalStatus', {
        id: RentalWarehouseColumnsIds.AVAILABILITY,
        minSize: RentalWarehouseColumnsSizes.min,
        maxSize: RentalWarehouseColumnsSizes.max,
        header: t('availability'),
        cell: info => {
          const status = info.getValue();

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return <RentalAvailabilityCell inactive={wasAlreadyAdded} status={status} />;
        },
      }),

      columnHelper.display({
        id: RentalWarehouseColumnsIds.ACTIONS,
        size: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.ACTIONS],
        maxSize: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.ACTIONS],
        minSize: RentalWarehouseColumnsSizes[RentalWarehouseColumnsIds.ACTIONS],
        header: ActionsHeaderCell,
        cell: info => {
          const productRow = info.row.original;

          const wasAlreadyAdded = orderStore.wasProductRowAlreadyAdded(info.row.original.id);

          return (
            <AddProductItemCell
              defaultDisabled={wasAlreadyAdded}
              onAdd={() => handleAddOrderItemRows([productRow])}
            />
          );
        },
      }),
    ];
  }, [productCategoryStore, canCreateOrder, orderStore, handleAddOrderItemRows, t]);
};
