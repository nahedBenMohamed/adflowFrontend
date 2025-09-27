import { routes } from '@/app';
import { SpanWithEllipsis } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckHeaderCell, CheckRowCell, ShipmentAvailableCell } from '../../../pages';
import type { ShipmentStore } from '../../../store';
import { NameCell } from '../components';
import {
  ProductsSectionType,
  ShipmentColumnsIds,
  ShipmentColumnsSizes,
  type ShipmentItemRow,
} from '../models';

export const useShipmentColumns = ({
  shipmentStore,
  currentPageDecodeUrl,
}: {
  shipmentStore: ShipmentStore;
  currentPageDecodeUrl: string;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.hooks.use_shipment_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ShipmentItemRow>();

    return [
      columnHelper.display({
        id: ShipmentColumnsIds.CHECKBOX,
        size: ShipmentColumnsSizes[ShipmentColumnsIds.CHECKBOX],
        minSize: ShipmentColumnsSizes[ShipmentColumnsIds.CHECKBOX],
        maxSize: ShipmentColumnsSizes[ShipmentColumnsIds.CHECKBOX],
        header: () => <CheckHeaderCell shipmentStore={shipmentStore} />,
        cell: info => {
          const orderItem = info.row.original;

          return <CheckRowCell orderItem={orderItem} shipmentStore={shipmentStore} />;
        },
      }),

      columnHelper.accessor('product.name', {
        id: ShipmentColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const productName = info.getValue();
          const { id, sectionId } = info.row.original.product;

          return (
            <NameCell
              name={productName}
              to={routes.product({
                sectionId,
                sectionType: ProductsSectionType.SALE,
                productId: id,
                from: currentPageDecodeUrl,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('product.sku', {
        id: ShipmentColumnsIds.SKU,
        size: ShipmentColumnsSizes[ShipmentColumnsIds.SKU],
        maxSize: ShipmentColumnsSizes[ShipmentColumnsIds.SKU],
        minSize: ShipmentColumnsSizes[ShipmentColumnsIds.SKU],
        header: t('sku'),
        cell: info => {
          const sku = info.getValue();

          return sku ? <SpanWithEllipsis text={sku} /> : null;
        },
      }),

      columnHelper.display({
        id: ShipmentColumnsIds.AVAILABLE,
        size: ShipmentColumnsSizes[ShipmentColumnsIds.AVAILABLE],
        maxSize: ShipmentColumnsSizes[ShipmentColumnsIds.AVAILABLE],
        minSize: ShipmentColumnsSizes[ShipmentColumnsIds.AVAILABLE],
        header: t('available'),
        cell: info => {
          const { shipment } = shipmentStore;

          return shipment ? (
            <ShipmentAvailableCell cellInfo={info} currentWarehouseId={shipment.warehouseId} />
          ) : null;
        },
      }),

      columnHelper.accessor('shipmentItem.quantity', {
        id: ShipmentColumnsIds.QUANTITY,
        size: ShipmentColumnsSizes[ShipmentColumnsIds.QUANTITY],
        maxSize: ShipmentColumnsSizes[ShipmentColumnsIds.QUANTITY],
        minSize: ShipmentColumnsSizes[ShipmentColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => {
          const quantity = info.getValue();
          const { unit: productUnit } = info.row.original.product;

          return quantity > 0 ? (
            <SpanWithEllipsis text={`${quantity}${productUnit ? ' ' + productUnit : ''}`} />
          ) : null;
        },
      }),
    ];
  }, [shipmentStore, t, currentPageDecodeUrl]);
};
