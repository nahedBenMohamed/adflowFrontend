import { MyInput, SpanWithEllipsis } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StockCell } from '../components';
import {
  ProductStocksColumnsIds,
  ProductStocksColumnsSizes,
  type ProductStockRow,
} from '../models';

export const useProductStocksColumns = () => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.hooks.use_product_stocks_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ProductStockRow>();

    return [
      columnHelper.accessor('warehouse.name', {
        id: ProductStocksColumnsIds.NAME,
        header: t('warehouse'),
        cell: info => {
          const { canView } = info.row.original.warehouse.userRights;

          return <SpanWithEllipsis text={info.getValue()} disabled={!canView} />;
        },
      }),

      columnHelper.display({
        id: ProductStocksColumnsIds.RESERVED,
        size: ProductStocksColumnsSizes[ProductStocksColumnsIds.RESERVED],
        minSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.RESERVED],
        maxSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.RESERVED],
        header: t('reserved'),
        cell: info => {
          const reserved = info.row.original.stock?.reserved ?? 0;
          const { canView } = info.row.original.warehouse.userRights;

          return <StockCell color="orange" stock={reserved} disabled={!canView} />;
        },
      }),

      columnHelper.display({
        id: ProductStocksColumnsIds.AVAILABLE,
        size: ProductStocksColumnsSizes[ProductStocksColumnsIds.AVAILABLE],
        minSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.AVAILABLE],
        maxSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.AVAILABLE],
        header: t('available'),
        cell: info => {
          const available = info.row.original.stock?.available ?? 0;
          const { canView } = info.row.original.warehouse.userRights;

          return (
            <StockCell
              stock={available}
              disabled={!canView}
              color={available > 0 ? 'green' : 'red'}
            />
          );
        },
      }),

      columnHelper.accessor('stockQuantity', {
        id: ProductStocksColumnsIds.QUANTITY,
        size: ProductStocksColumnsSizes[ProductStocksColumnsIds.QUANTITY],
        minSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.QUANTITY],
        maxSize: ProductStocksColumnsSizes[ProductStocksColumnsIds.QUANTITY],
        header: t('stock'),
        cell: info => {
          const { canView } = info.row.original.warehouse.userRights;

          return <MyInput disabled={!canView} variant="outlined" model={info.getValue()} />;
        },
      }),
    ];
  }, [t]);
};
