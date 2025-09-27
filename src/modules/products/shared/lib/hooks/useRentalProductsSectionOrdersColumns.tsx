import { routes, userStore } from '@/app';
import { ColoredBlock, LinkedEntityTag, SpanWithEllipsis, UserView } from '@/shared';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductSectionOrdersDateCell } from '../../../pages';
import { NameCell } from '../components';
import { generateOrderName, generateRentalOrderStatusOptions } from '../helpers';
import {
  ProductsSectionOrdersCommonColumnsIds,
  ProductsSectionOrdersCommonColumnsSizes,
  ProductsSectionType,
  type RentalOrder,
} from '../models';

interface OrderNameLinkProps {
  entityId: number;
  entityTypeId: number;
}

type OrderColumnsType = 'order' | 'shipment';

export const useRentalProductsSectionOrdersColumns = ({
  type,
  sectionId,
  fromEncoded,
  orderNameLinkProps,
}: {
  sectionId: number;
  type: OrderColumnsType;
  fromEncoded?: string;
  orderNameLinkProps?: OrderNameLinkProps;
}) => {
  const { t: t1 } = useTranslation('module.products', {
    keyPrefix:
      'products.pages.card_products_orders_page.hooks.use_rental_products_section_orders_columns',
  });

  const { t: t2 } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.rental_order_status_select',
  });

  const rentalOrderStatusOptions = generateRentalOrderStatusOptions(t2);

  return useMemo(() => {
    const columnHelper = createColumnHelper<RentalOrder>();

    const columns = [
      columnHelper.display({
        id: ProductsSectionOrdersCommonColumnsIds.NAME,
        header: t1('name'),
        cell: info => {
          const { orderNumber, id: orderId } = info.row.original;

          const link = orderNameLinkProps
            ? routes.cardProductsOrder({
                orderId,
                sectionId,
                from: fromEncoded,
                entityId: orderNameLinkProps.entityId,
                sectionType: ProductsSectionType.RENTAL,
                entityTypeId: orderNameLinkProps.entityTypeId,
              })
            : routes.shipment({
                sectionId,
                shipmentId: orderId,
                sectionType: ProductsSectionType.RENTAL,
              });

          return (
            <NameCell
              to={link}
              name={
                type === 'order'
                  ? generateOrderName({ orderNumber, t: t1 })
                  : t1('shipment', { number: orderNumber })
              }
            />
          );
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

      columnHelper.accessor('status', {
        id: ProductsSectionOrdersCommonColumnsIds.STATUS,
        size: ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        minSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        maxSize:
          ProductsSectionOrdersCommonColumnsSizes[ProductsSectionOrdersCommonColumnsIds.STATUS],
        header: t1('status'),
        cell: info => {
          const status = info.getValue();
          const statusOption = rentalOrderStatusOptions.find(o => o.value === status);

          return statusOption && statusOption.extra?.bgColor ? (
            <ColoredBlock text={statusOption.label} bgColor={statusOption.extra.bgColor} />
          ) : null;
        },
      }),
    ];

    if (type === 'shipment') {
      columns.splice(
        1,
        0,
        columnHelper.accessor('entityInfo', {
          id: ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY,
          size: ProductsSectionOrdersCommonColumnsSizes[
            ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY
          ],
          minSize:
            ProductsSectionOrdersCommonColumnsSizes[
              ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY
            ],
          maxSize:
            ProductsSectionOrdersCommonColumnsSizes[
              ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY
            ],
          header: t1('linked_entity'),
          cell: info => {
            const entityInfo = info.getValue();

            return (
              <LinkedEntityTag
                $disabled={!entityInfo.hasAccess}
                to={routes.card({ entityTypeId: entityInfo.entityTypeId, entityId: entityInfo.id })}
                $maxWidth={`${
                  ProductsSectionOrdersCommonColumnsSizes[
                    ProductsSectionOrdersCommonColumnsIds.LINKED_ENTITY
                  ]
                }px`}
              >
                <SpanWithEllipsis text={entityInfo.name} />
              </LinkedEntityTag>
            );
          },
        }) as ColumnDef<RentalOrder, unknown>
      );
    }

    return columns;
  }, [sectionId, type, orderNameLinkProps, rentalOrderStatusOptions, fromEncoded, t1]);
};
