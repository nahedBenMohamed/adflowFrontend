import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WarehouseStore } from '../../../store';
import { CreateStockCell } from '../components';
import { CreateStocksColumnsIds, CreateStocksColumnsSizes, type CreateStockRow } from '../models';

export const useCreateStocksColumns = (warehouseStore: WarehouseStore) => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.products_page.hooks.use_create_stocks_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<CreateStockRow>();

    return [
      columnHelper.accessor('warehouseId', {
        id: CreateStocksColumnsIds.WAREHOUSE_NAME,
        header: t('warehouse'),
        cell: info => {
          const warehouseId = info.getValue();
          const warehouseName = warehouseStore.getWarehouseById(warehouseId).name;

          return warehouseName;
        },
      }),

      columnHelper.accessor('stockQuantity', {
        id: CreateStocksColumnsIds.STOCK,
        header: t('stock'),
        size: CreateStocksColumnsSizes[CreateStocksColumnsIds.STOCK],
        minSize: CreateStocksColumnsSizes[CreateStocksColumnsIds.STOCK],
        maxSize: CreateStocksColumnsSizes[CreateStocksColumnsIds.STOCK],
        cell: info => <CreateStockCell cellInfo={info} />,
      }),
    ];
  }, [warehouseStore, t]);
};
