import {
  ProductsOrderDiscountCell,
  ProductsOrderPriceCell,
  ProductsOrderPriceHeadCell,
  ReservationQuantityCell,
} from '@/modules/products';
import { SpanWithEllipsis } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppointmentOrderStore } from '../../../store';
import { AppointmentServiceAmountCell } from '../components';
import {
  AppointmentServiceBlockColumnsIds,
  AppointmentServiceBlockColumnsSizes,
  type ScheduleAppointmentOrderItemRow,
} from '../models';

export const useAppointmentServiceBlockColumns = (orderStore: AppointmentOrderStore) => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.hooks.use_appointment_service_block_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ScheduleAppointmentOrderItemRow>();

    return [
      columnHelper.accessor('service.prices', {
        id: AppointmentServiceBlockColumnsIds.PRICE,
        header: () => <ProductsOrderPriceHeadCell currentCurrency={orderStore.currentCurrency} />,
        cell: info => {
          const prices = info.getValue();
          const { price } = info.row.original;

          return <ProductsOrderPriceCell inModal model={price} prices={prices} />;
        },
      }),

      columnHelper.accessor('discount', {
        id: AppointmentServiceBlockColumnsIds.DISCOUNT,
        size: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.DISCOUNT],
        minSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.DISCOUNT],
        maxSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.DISCOUNT],
        header: () => <SpanWithEllipsis text={t('discount')} />,
        cell: info => {
          const discountModel = info.getValue();
          const { maxDiscount } = info.row.original;

          return (
            <ProductsOrderDiscountCell
              discountModel={discountModel}
              maxDiscount={maxDiscount}
              width="72px"
            />
          );
        },
      }),

      columnHelper.accessor('quantity', {
        id: AppointmentServiceBlockColumnsIds.QUANTITY,
        size: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.QUANTITY],
        minSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.QUANTITY],
        maxSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.QUANTITY],
        header: () => <SpanWithEllipsis text={t('quantity')} />,
        cell: info => {
          const { quantity } = info.row.original;

          return <ReservationQuantityCell model={quantity} maxQuantity={null} />;
        },
      }),

      columnHelper.display({
        id: AppointmentServiceBlockColumnsIds.AMOUNT,
        size: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.AMOUNT],
        minSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.AMOUNT],
        maxSize: AppointmentServiceBlockColumnsSizes[AppointmentServiceBlockColumnsIds.AMOUNT],
        header: () => <SpanWithEllipsis text={t('amount')} />,
        cell: info => {
          const orderItemRow = info.row.original;

          return <AppointmentServiceAmountCell orderItemRow={orderItemRow} />;
        },
      }),
    ];
  }, [orderStore, t]);
};
