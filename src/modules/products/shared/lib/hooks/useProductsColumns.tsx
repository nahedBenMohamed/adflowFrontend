import { routes } from '@/app';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductStocksCell } from '../../../pages';
import type { WarehouseStore } from '../../../store';
import { ProductPriceCell, RentalAvailabilityCell, type Product } from '../../lib';
import { NameCell } from '../components';
import { ProductsColumnsIds, ProductsColumnsSizes, ProductsSectionType } from '../models';

export const useProductsColumns = ({
  sectionType,
  warehouseStore,
  canViewProduct,
  canEditProducts,
  getSavedColumnSize,
}: {
  sectionType: ProductsSectionType;
  warehouseStore: WarehouseStore;
  canViewProduct: boolean;
  canEditProducts: boolean;
  getSavedColumnSize: (columnId: string) => number;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.hooks.use_products_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<Product>();

    const columns = [
      columnHelper.accessor('name', {
        id: ProductsColumnsIds.NAME,
        size: getSavedColumnSize(ProductsColumnsIds.NAME),
        minSize: ProductsColumnsSizes[ProductsColumnsIds.NAME],
        maxSize: ProductsColumnsSizes.max,
        header: t('name'),
        cell: info => {
          const name = info.getValue();
          const { id, sectionId } = info.row.original;

          return (
            <NameCell
              name={name}
              disabled={!canViewProduct}
              to={routes.product({ sectionId, sectionType, productId: id })}
            />
          );
        },
      }),

      columnHelper.accessor('prices', {
        id: ProductsColumnsIds.PRICES,
        size: getSavedColumnSize(ProductsColumnsIds.PRICES),
        minSize: ProductsColumnsSizes.min,
        maxSize: ProductsColumnsSizes.max,
        header: t('prices'),
        cell: info => <ProductPriceCell prices={info.getValue()} />,
      }),

      columnHelper.accessor('sku', {
        id: ProductsColumnsIds.SKU,
        size: getSavedColumnSize(ProductsColumnsIds.SKU),
        minSize: ProductsColumnsSizes.min,
        maxSize: ProductsColumnsSizes.max,
        header: t('sku'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('tax', {
        id: ProductsColumnsIds.TAX,
        size: getSavedColumnSize(ProductsColumnsIds.TAX),
        minSize: ProductsColumnsSizes.min,
        maxSize: ProductsColumnsSizes.max,
        header: t('tax'),
        cell: info => {
          const tax = info.getValue();

          return tax && tax > 0 ? `${tax}%` : 0;
        },
      }),

      columnHelper.accessor('stocks', {
        id: ProductsColumnsIds.STOCKS,
        size: getSavedColumnSize(ProductsColumnsIds.STOCKS),
        minSize: ProductsColumnsSizes.min,
        maxSize: ProductsColumnsSizes.max,
        header: t('stocks'),
        cell: info => {
          const isService = info.row.original.isService();
          const stocks = info.getValue();

          return isService ? null : (
            <ProductStocksCell
              stocks={stocks}
              sectionType={sectionType}
              warehouseStore={warehouseStore}
              productId={info.row.original.id}
              canEditProducts={canEditProducts}
            />
          );
        },
      }),

      columnHelper.accessor('unit', {
        id: ProductsColumnsIds.UNIT,
        size: getSavedColumnSize(ProductsColumnsIds.UNIT),
        minSize: ProductsColumnsSizes.min,
        maxSize: ProductsColumnsSizes.max,
        header: t('unit'),
        cell: info => info.getValue(),
      }),
    ] as ColumnDef<Product, unknown>[];

    if (sectionType === ProductsSectionType.RENTAL) {
      columns.push(
        columnHelper.accessor('rentalStatus', {
          id: ProductsColumnsIds.AVAILABILITY,
          size: getSavedColumnSize(ProductsColumnsIds.AVAILABILITY),
          minSize: ProductsColumnsSizes.min,
          maxSize: ProductsColumnsSizes.max,
          header: t('availability'),
          cell: info => {
            const status = info.getValue();

            return <RentalAvailabilityCell status={status} />;
          },
        }) as ColumnDef<Product, unknown>
      );
    }

    return columns;
  }, [sectionType, warehouseStore, canViewProduct, canEditProducts, getSavedColumnSize, t]);
};
