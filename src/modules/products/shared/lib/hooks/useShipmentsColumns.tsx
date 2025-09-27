import { routes } from '@/app';
import { LinkedEntityTag, SpanWithEllipsis } from '@/shared';
import type { UseMutateFunction } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseChangeShipmentStatusArgs } from '../../../api';
import { ShipmentDateCell } from '../../../pages';
import { orderStatusStore, type WarehouseStore } from '../../../store';
import { NameCell, OrderStatusSelect } from '../components';
import {
  ProductsSectionType,
  ShipmentsColumnsIds,
  ShipmentsColumnsSizes,
  type Shipment,
  type ShipmentRow,
} from '../models';

export const useShipmentsColumns = ({
  warehouseStore,
  canEdit,
  changeShipmentStatus,
}: {
  warehouseStore: WarehouseStore;
  canEdit: boolean;
  changeShipmentStatus: UseMutateFunction<Shipment, unknown, UseChangeShipmentStatusArgs, unknown>;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipments_page.hooks.use_shipments_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ShipmentRow>();

    return [
      columnHelper.accessor('shipment.name', {
        id: ShipmentsColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const { shipment } = info.row.original;
          const { id, sectionId, orderId } = shipment;

          return (
            <NameCell
              name={t('shipment', { number: orderId })}
              inactive={shipment.isShipped()}
              to={routes.shipment({
                sectionId,
                sectionType: ProductsSectionType.SALE,
                shipmentId: id,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('shipment.entityInfo', {
        id: ShipmentsColumnsIds.LINKED_ENTITY,
        size: ShipmentsColumnsSizes[ShipmentsColumnsIds.LINKED_ENTITY],
        minSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.LINKED_ENTITY],
        maxSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.LINKED_ENTITY],
        header: t('linked_entity'),
        cell: info => {
          const entityInfo = info.getValue();
          const { shipment } = info.row.original;

          return (
            <LinkedEntityTag
              $inactive={shipment.isShipped()}
              $disabled={!entityInfo.hasAccess}
              to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
              $maxWidth={`${ShipmentsColumnsSizes[ShipmentsColumnsIds.LINKED_ENTITY]}px`}
            >
              <SpanWithEllipsis text={entityInfo.name} />
            </LinkedEntityTag>
          );
        },
      }),

      columnHelper.accessor('shipment.warehouseId', {
        id: ShipmentsColumnsIds.WAREHOUSE,
        size: ShipmentsColumnsSizes[ShipmentsColumnsIds.WAREHOUSE],
        minSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.WAREHOUSE],
        maxSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.WAREHOUSE],
        header: t('warehouse'),
        cell: info => {
          const { shipment } = info.row.original;
          const warehouseId = info.getValue();

          const warehouseName = warehouseStore.findWarehouseById(warehouseId)?.name ?? t('unknown');

          return <SpanWithEllipsis inactive={shipment.isShipped()} text={warehouseName} />;
        },
      }),

      columnHelper.accessor('shipment.createdAt', {
        id: ShipmentsColumnsIds.CREATED_AT,
        size: ShipmentsColumnsSizes[ShipmentsColumnsIds.CREATED_AT],
        minSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.CREATED_AT],
        maxSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.CREATED_AT],
        header: t('created_at'),
        cell: info => {
          const createdAt = info.getValue();
          const { shipment } = info.row.original;

          return (
            <ShipmentDateCell icon="created_at" inactive={shipment.isShipped()} date={createdAt} />
          );
        },
      }),

      columnHelper.accessor('shipment.shippedAt', {
        id: ShipmentsColumnsIds.SHIPPED_AT,
        size: ShipmentsColumnsSizes[ShipmentsColumnsIds.SHIPPED_AT],
        minSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.SHIPPED_AT],
        maxSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.SHIPPED_AT],
        header: t('shipped_at'),
        cell: info => {
          const shippedAt = info.getValue();
          const { shipment } = info.row.original;

          return (
            <ShipmentDateCell icon="shipped_at" inactive={shipment.isShipped()} date={shippedAt} />
          );
        },
      }),

      columnHelper.accessor('shipmentStatusModel', {
        id: ShipmentsColumnsIds.STATUS,
        size: ShipmentsColumnsSizes[ShipmentsColumnsIds.STATUS],
        minSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.STATUS],
        maxSize: ShipmentsColumnsSizes[ShipmentsColumnsIds.STATUS],
        header: t('status'),
        cell: info => {
          const model = info.getValue();

          return (
            <OrderStatusSelect
              model={model}
              disabled={!canEdit}
              statuses={orderStatusStore.getShipmentAvailableStatuses(model.value as number)}
              onChange={statusId =>
                changeShipmentStatus({
                  statusId,
                  shipmentId: info.row.original.shipment.id,
                })
              }
            />
          );
        },
      }),
    ];
  }, [warehouseStore, canEdit, changeShipmentStatus, t]);
};
