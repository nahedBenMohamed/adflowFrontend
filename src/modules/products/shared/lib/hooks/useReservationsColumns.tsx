import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReservationQuantityCell, StockCell, WarehouseNameCell } from '../components';
import { ReservationsColumnsIds, ReservationsColumnsSizes, type ReservationRow } from '../models';

export const useReservationsColumns = () => {
  const { t } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_order_page.ui.card_products_order_component.hooks.use_reservations_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ReservationRow>();

    return [
      columnHelper.accessor('warehouseName', {
        id: ReservationsColumnsIds.NAME,
        header: t('warehouse_name'),
        cell: info => {
          const { canView } = info.row.original.warehouseUserRights;

          return <WarehouseNameCell name={info.getValue()} disabled={!canView} />;
        },
      }),

      columnHelper.accessor('stock.stockQuantity', {
        id: ReservationsColumnsIds.STOCK,
        size: ReservationsColumnsSizes[ReservationsColumnsIds.STOCK],
        minSize: ReservationsColumnsSizes[ReservationsColumnsIds.STOCK],
        maxSize: ReservationsColumnsSizes[ReservationsColumnsIds.STOCK],
        header: t('stock'),
        cell: info => {
          const { canView } = info.row.original.warehouseUserRights;

          return <StockCell stock={info.getValue()} disabled={!canView} />;
        },
      }),

      columnHelper.accessor('stock.reserved', {
        id: ReservationsColumnsIds.RESERVED,
        size: ReservationsColumnsSizes[ReservationsColumnsIds.RESERVED],
        minSize: ReservationsColumnsSizes[ReservationsColumnsIds.RESERVED],
        maxSize: ReservationsColumnsSizes[ReservationsColumnsIds.RESERVED],
        header: t('reserved'),
        cell: info => {
          const { canView } = info.row.original.warehouseUserRights;

          return <StockCell color="red" stock={info.getValue()} disabled={!canView} />;
        },
      }),

      columnHelper.accessor('stock.available', {
        id: ReservationsColumnsIds.AVAILABLE,
        size: ReservationsColumnsSizes[ReservationsColumnsIds.AVAILABLE],
        minSize: ReservationsColumnsSizes[ReservationsColumnsIds.AVAILABLE],
        maxSize: ReservationsColumnsSizes[ReservationsColumnsIds.AVAILABLE],
        header: t('available'),
        cell: info => {
          const { canView } = info.row.original.warehouseUserRights;

          return <StockCell color="green" stock={info.getValue()} disabled={!canView} />;
        },
      }),

      columnHelper.accessor('quantity', {
        id: ReservationsColumnsIds.QUANTITY,
        size: ReservationsColumnsSizes[ReservationsColumnsIds.QUANTITY],
        minSize: ReservationsColumnsSizes[ReservationsColumnsIds.QUANTITY],
        maxSize: ReservationsColumnsSizes[ReservationsColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => {
          const quantityModel = info.getValue();
          const reservationRow = info.row.original;
          const { canView } = reservationRow.warehouseUserRights;

          return (
            <ReservationQuantityCell
              disabled={!canView}
              model={quantityModel}
              maxQuantity={reservationRow.maxQuantity}
            />
          );
        },
      }),
    ];
  }, [t]);
};
