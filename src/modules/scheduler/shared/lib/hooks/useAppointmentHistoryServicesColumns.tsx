import { AmountCellRoot, type OrderItem } from '@/modules/products';
import { SpanWithEllipsis, currencyFormatterHelper, type Currency } from '@/shared';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getOrderItemAmount } from '../helpers';
import {
  AppointmentHistoryServicesColumnsIds,
  AppointmentHistoryServicesColumnsSizes,
} from '../models';

export const useAppointmentHistoryServicesColumns = (currency: Currency) => {
  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.hooks.use_appointments_history_services_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<OrderItem>();

    return [
      columnHelper.accessor('productInfo.name', {
        id: AppointmentHistoryServicesColumnsIds.NAME,
        size: AppointmentHistoryServicesColumnsSizes[AppointmentHistoryServicesColumnsIds.NAME],
        header: t('name'),
        cell: info => {
          const name = info.getValue();

          return <SpanWithEllipsis text={name} />;
        },
      }),

      columnHelper.accessor('unitPrice', {
        id: AppointmentHistoryServicesColumnsIds.PRICE,
        size: AppointmentHistoryServicesColumnsSizes[AppointmentHistoryServicesColumnsIds.PRICE],
        header: t('price'),
        cell: info => {
          const price = info.getValue();

          return (
            <SpanWithEllipsis text={currencyFormatterHelper.format({ value: price, currency })} />
          );
        },
      }),

      columnHelper.accessor('quantity', {
        id: AppointmentHistoryServicesColumnsIds.QUANTITY,
        size: AppointmentHistoryServicesColumnsSizes[AppointmentHistoryServicesColumnsIds.QUANTITY],
        header: t('quantity'),
        cell: info => {
          const quantity = info.getValue();

          return <SpanWithEllipsis text={String(quantity)} />;
        },
      }),

      columnHelper.accessor('discount', {
        id: AppointmentHistoryServicesColumnsIds.DISCOUNT,
        size: AppointmentHistoryServicesColumnsSizes[AppointmentHistoryServicesColumnsIds.DISCOUNT],
        header: t('discount'),
        cell: info => {
          const discount = info.getValue();

          return <SpanWithEllipsis text={`${discount}%`} />;
        },
      }),

      columnHelper.display({
        id: AppointmentHistoryServicesColumnsIds.AMOUNT,
        size: AppointmentHistoryServicesColumnsSizes[AppointmentHistoryServicesColumnsIds.AMOUNT],
        header: t('amount'),
        cell: info => {
          const orderItem = info.row.original;

          const amount = getOrderItemAmount(orderItem);

          return (
            <AmountCellRoot amount={currencyFormatterHelper.format({ value: amount, currency })} />
          );
        },
      }),
    ];
  }, [currency, t]);
};
