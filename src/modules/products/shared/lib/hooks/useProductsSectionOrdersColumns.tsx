import { routes, userStore } from '@/app';
import { ColoredBlock, UserView } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductSectionOrdersDateCell, ProductSectionOrdersWarehouseCell } from '../../../pages';
import { orderStatusStore, type WarehouseStore } from '../../../store';
import { NameCell } from '../components';
import { generateOrderName } from '../helpers';
import {
  ProductSectionOrdersColumnsIds,
  ProductSectionOrdersColumnsSize,
  ProductsSectionOrdersCommonColumnsIds,
  ProductsSectionOrdersCommonColumnsSizes,
  ProductsSectionType,
  type Order,
} from '../models';

export const useProductsSectionOrdersColumns = ({
  entityTypeId,
  entityId,
  sectionId,
  warehouseStore,
  fromEncoded,
}: {
  entityId: number;
  sectionId: number;
  entityTypeId: number;
  warehouseStore: WarehouseStore;
  fromEncoded?: string;
}) => {
  const { t: t1 } = useTranslation('module.products', {
    keyPrefix: 'products.pages.card_products_orders_page.hooks.use_products_section_orders_columns',
  });

  const { t: t2 } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.order_status_select',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<Order>();

    return [
      columnHelper.display({
        id: ProductsSectionOrdersCommonColumnsIds.NAME,
        header: t1('name'),
        cell: info => {
          const { orderNumber, id } = info.row.original;

          return (
            <NameCell
              name={generateOrderName({ orderNumber, t: t1 })}
              to={routes.cardProductsOrder({
                entityTypeId,
                entityId,
                sectionId,
                orderId: id,
                from: fromEncoded,
                sectionType: ProductsSectionType.SALE,
              })}
            />
          );
        },
      }),

      columnHelper.accessor('warehouseId', {
        id: ProductsSectionOrdersCommonColumnsIds.WAREHOUSE,
        size: ProductsSectionOrdersCommonColumnsSizes[
          ProductsSectionOrdersCommonColumnsIds.WAREHOUSE
        ],
        minSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.WAREHOUSE],
        maxSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.WAREHOUSE],
        header: t1('warehouse'),
        cell: info => {
          const warehouseId = info.getValue();

          return (
            <ProductSectionOrdersWarehouseCell
              warehouseId={warehouseId}
              warehouseStore={warehouseStore}
            />
          );
        },
      }),

      columnHelper.accessor('shippedAt', {
        id: ProductSectionOrdersColumnsIds.SHIPPED_AT,
        size: ProductSectionOrdersColumnsSize[ProductSectionOrdersColumnsIds.SHIPPED_AT],
        minSize: ProductSectionOrdersColumnsSize[ProductSectionOrdersColumnsIds.SHIPPED_AT],
        maxSize: ProductSectionOrdersColumnsSize[ProductSectionOrdersColumnsIds.SHIPPED_AT],
        header: t1('shipped_at'),
        cell: info => {
          const shippedAt = info.getValue();

          return shippedAt ? <ProductSectionOrdersDateCell date={shippedAt} /> : null;
        },
      }),

      columnHelper.accessor('createdAt', {
        id: ProductsSectionOrdersCommonColumnsIds.CREATED_AT,
        size: ProductsSectionOrdersCommonColumnsSizes[
          ProductsSectionOrdersCommonColumnsIds.CREATED_AT
        ],
        minSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.CREATED_AT],
        maxSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.CREATED_AT],
        header: t1('created_at'),
        cell: info => {
          const createdAt = info.getValue();

          return <ProductSectionOrdersDateCell date={createdAt} />;
        },
      }),

      columnHelper.accessor('createdBy', {
        id: ProductsSectionOrdersCommonColumnsIds.CREATED_BY,
        size: ProductsSectionOrdersCommonColumnsSizes[
          ProductsSectionOrdersCommonColumnsIds.CREATED_BY
        ],
        minSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.CREATED_BY],
        maxSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.CREATED_BY],
        header: t1('creator'),
        cell: info => {
          const createdBy = info.getValue();
          const creator = userStore.getById(createdBy);

          return <UserView user={creator} />;
        },
      }),

      columnHelper.accessor('statusId', {
        id: ProductsSectionOrdersCommonColumnsIds.STATUS,
        size: ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        minSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        maxSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        header: t1('status'),
        cell: info => {
          const statusId = info.getValue();
          const status = statusId ? orderStatusStore.getById(statusId) : null;

          return status ? (
            <ColoredBlock bgColor={status.color} text={t2(`statuses.${status.code}`)} />
          ) : null;
        },
      }),
    ];
  }, [entityTypeId, entityId, sectionId, warehouseStore, fromEncoded, t1, t2]);
};
