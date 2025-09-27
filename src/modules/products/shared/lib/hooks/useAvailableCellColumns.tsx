import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WarehouseStore } from '../../../store';
import { StockCell, WarehouseNameCell } from '../components';
import { AvailableCellColumnsIds, AvailableCellColumnsSizes, type Stock } from '../models';

export const useAvailableCellColumns = (warehouseStore: WarehouseStore) => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.hooks.use_available_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<Stock>();

    return [
      columnHelper.accessor('warehouseId', {
        id: AvailableCellColumnsIds.NAME,
        header: t('name'),
        size: AvailableCellColumnsSizes[AvailableCellColumnsIds.NAME],
        minSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.NAME],
        maxSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.NAME],
        cell: info => {
          const warehouseId = info.getValue();
          const warehouse = warehouseStore.findWarehouseById(warehouseId);

          const warehouseName = warehouse?.name ?? t('unknown');
          const canView = warehouse?.userRights.canView ?? false;

          return <WarehouseNameCell name={warehouseName} disabled={!canView} />;
        },
      }),

      columnHelper.accessor('stockQuantity', {
        id: AvailableCellColumnsIds.STOCK,
        size: AvailableCellColumnsSizes[AvailableCellColumnsIds.STOCK],
        minSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.STOCK],
        maxSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.STOCK],
        header: t('stock'),
        cell: info => {
          const stock = info.getValue();
          const warehouseId = info.row.original.warehouseId;
          const warehouse = warehouseStore.findWarehouseById(warehouseId);
          const canView = warehouse?.userRights.canView ?? false;

          return <StockCell disabled={!canView} color={stock > 0 ? 'gray' : 'red'} stock={stock} />;
        },
      }),

      columnHelper.accessor('reserved', {
        id: AvailableCellColumnsIds.RESERVED,
        size: AvailableCellColumnsSizes[AvailableCellColumnsIds.RESERVED],
        minSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.RESERVED],
        maxSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.RESERVED],
        header: t('reserved'),
        cell: info => {
          const warehouseId = info.row.original.warehouseId;
          const warehouse = warehouseStore.findWarehouseById(warehouseId);
          const canView = warehouse?.userRights.canView ?? false;

          return <StockCell disabled={!canView} color="orange" stock={info.getValue()} />;
        },
      }),

      columnHelper.accessor('available', {
        id: AvailableCellColumnsIds.AVAILABLE,
        size: AvailableCellColumnsSizes[AvailableCellColumnsIds.AVAILABLE],
        minSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.AVAILABLE],
        maxSize: AvailableCellColumnsSizes[AvailableCellColumnsIds.AVAILABLE],
        header: t('available'),
        cell: info => {
          const available = info.getValue();
          const warehouseId = info.row.original.warehouseId;
          const warehouse = warehouseStore.findWarehouseById(warehouseId);
          const canView = warehouse?.userRights.canView ?? false;

          return (
            <StockCell
              stock={available}
              disabled={!canView}
              color={available > 0 ? 'green' : 'red'}
            />
          );
        },
      }),
    ];
  }, [warehouseStore, t]);
};
