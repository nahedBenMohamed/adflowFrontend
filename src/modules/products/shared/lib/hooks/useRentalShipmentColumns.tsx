import { routes } from '@/app';
import { SpanWithEllipsis, currencyFormatterHelper } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckHeaderCell, CheckRowCell } from '../../../pages';
import type { RentalShipmentStore } from '../../../store';
import { NameCell } from '../components';
import {
  ProductsSectionType,
  RentalShipmentColumnsIds,
  RentalShipmentColumnsSizes,
  type RentalShipmentItemRow,
} from '../models';

export const useRentalShipmentColumns = ({
  shipmentStore,
  currentPageDecodeUrl,
}: {
  shipmentStore: RentalShipmentStore;
  currentPageDecodeUrl: string;
}) => {
  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipment_page.hooks.use_rental_shipment_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<RentalShipmentItemRow>();

    return [
      columnHelper.display({
        id: RentalShipmentColumnsIds.CHECKBOX,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.CHECKBOX],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.CHECKBOX],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.CHECKBOX],
        header: () => <CheckHeaderCell shipmentStore={shipmentStore} />,
        cell: info => {
          const orderItem = info.row.original;

          return <CheckRowCell orderItem={orderItem} shipmentStore={shipmentStore} />;
        },
      }),

      columnHelper.accessor('product.name', {
        id: RentalShipmentColumnsIds.NAME,
        header: t('name'),
        cell: info => {
          const name = info.getValue();
          const { id: productId, sectionId } = info.row.original.product;

          return (
            <NameCell
              to={routes.product({
                sectionId,
                sectionType: ProductsSectionType.RENTAL,
                productId,
                from: currentPageDecodeUrl,
              })}
              name={name}
            />
          );
        },
      }),

      columnHelper.accessor('product.sku', {
        id: RentalShipmentColumnsIds.SKU,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.SKU],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.SKU],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.SKU],
        header: t('sku'),
        cell: info => {
          const sku = info.getValue();

          return sku ? <SpanWithEllipsis text={sku} /> : null;
        },
      }),

      columnHelper.accessor('tax', {
        id: RentalShipmentColumnsIds.TAX,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TAX],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TAX],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TAX],
        header: t('tax'),
        cell: info => {
          const tax = info.getValue();

          return tax ? <SpanWithEllipsis text={tax + '%'} /> : null;
        },
      }),

      columnHelper.accessor('discount', {
        id: RentalShipmentColumnsIds.DISCOUNT,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.DISCOUNT],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.DISCOUNT],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.DISCOUNT],
        header: t('discount'),
        cell: info => {
          const discount = info.getValue();

          return discount ? <SpanWithEllipsis text={discount + '%'} /> : null;
        },
      }),

      columnHelper.display({
        id: RentalShipmentColumnsIds.TOTAL,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TOTAL],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TOTAL],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.TOTAL],
        header: t('total'),
        cell: info => {
          const amount = info.row.original.getAmount();
          const { currency } = info.row.original;

          return (
            <SpanWithEllipsis text={currencyFormatterHelper.format({ value: amount, currency })} />
          );
        },
      }),

      columnHelper.display({
        id: RentalShipmentColumnsIds.QUANTITY,
        size: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.QUANTITY],
        maxSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.QUANTITY],
        minSize: RentalShipmentColumnsSizes[RentalShipmentColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => {
          const { unit } = info.row.original.product;

          return <SpanWithEllipsis text={`1${unit ? ' ' + unit : ''}`} />;
        },
      }),
    ];
  }, [shipmentStore, currentPageDecodeUrl, t]);
};
