import { AmountCellRoot } from '@/modules/products';
import { ColoredBlock, SpanWithEllipsis, currencyFormatterHelper, type Currency } from '@/shared';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppointmentsHistoryServicesCell, UserOrDepartmentViewCell } from '../components';
import {
  AppointmentHistoryColumnsIds,
  AppointmentHistoryColumnsSizes,
  type Schedule,
  type ScheduleAppointment,
} from '../models';
import { useGetScheduleAppointmentStatusesOptions } from './useGetScheduleAppointmentStatuses';

export const useAppointmentsHistoryColumns = ({
  currency,
  selectedSchedule,
  openedFromCard,
}: {
  currency: Currency;
  selectedSchedule: Schedule;
  openedFromCard?: boolean;
}) => {
  const statuses = useGetScheduleAppointmentStatusesOptions();

  const { t } = useTranslation('module.scheduler', {
    keyPrefix:
      'scheduler.pages.scheduler_schedule_view_page.hooks.use_appointments_history_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ScheduleAppointment>();

    const columns = [
      columnHelper.accessor('startDate', {
        id: AppointmentHistoryColumnsIds.DATE,
        header: t('date'),
        cell: info => {
          const date = info.getValue();

          return <SpanWithEllipsis text={date.displayLong()} />;
        },
      }),

      columnHelper.display({
        id: AppointmentHistoryColumnsIds.TIME,
        size: openedFromCard
          ? 146
          : AppointmentHistoryColumnsSizes[AppointmentHistoryColumnsIds.TIME],
        header: t('time'),
        cell: info => {
          const { startDate, endDate } = info.row.original;

          return (
            <SpanWithEllipsis text={`${startDate.displayTime()} - ${endDate.displayTime()}`} />
          );
        },
      }),

      columnHelper.accessor('performerId', {
        id: AppointmentHistoryColumnsIds.PERFORMER,
        size: openedFromCard
          ? 162
          : AppointmentHistoryColumnsSizes[AppointmentHistoryColumnsIds.PERFORMER],
        header: t('performer'),
        cell: info => {
          const performerId = info.getValue();
          const performerObjectId = selectedSchedule.getObjectIdByPerformerId(performerId);

          if (!performerObjectId) {
            throw new Error(
              `Failed to find performer object id for performer id ${performerId} in schedule ${selectedSchedule.id}`
            );
          }

          return (
            <UserOrDepartmentViewCell
              performerObjectId={performerObjectId}
              performerType={selectedSchedule.performersType}
            />
          );
        },
      }),
    ] as ColumnDef<ScheduleAppointment, unknown>[];

    if (!openedFromCard)
      columns.push(
        ...([
          columnHelper.display({
            id: AppointmentHistoryColumnsIds.SERVICES,
            size: AppointmentHistoryColumnsSizes[AppointmentHistoryColumnsIds.SERVICES],
            header: t('services'),
            cell: info => {
              const { order } = info.row.original;

              if (!order) return null;

              return (
                <AppointmentsHistoryServicesCell orderItems={order.items} currency={currency} />
              );
            },
          }),

          columnHelper.display({
            id: AppointmentHistoryColumnsIds.TOTAL,
            size: AppointmentHistoryColumnsSizes[AppointmentHistoryColumnsIds.TOTAL],
            header: t('total'),
            cell: info => {
              const { order } = info.row.original;

              if (!order) return null;

              return (
                <AmountCellRoot
                  amount={currencyFormatterHelper.format({
                    value: order.totalAmount,
                    currency: order.currency,
                  })}
                />
              );
            },
          }),

          columnHelper.accessor('status', {
            id: AppointmentHistoryColumnsIds.STATUS,
            size: AppointmentHistoryColumnsSizes[AppointmentHistoryColumnsIds.STATUS],
            header: t('status'),
            cell: info => {
              const status = info.getValue();
              const statusOption = statuses.find(s => s.value === status);

              return statusOption && statusOption.extra?.bgColor ? (
                <ColoredBlock bgColor={statusOption.extra.bgColor} text={statusOption.label} />
              ) : null;
            },
          }),
        ] as ColumnDef<ScheduleAppointment, unknown>[])
      );

    return columns;
  }, [statuses, currency, selectedSchedule, openedFromCard, t]);
};
