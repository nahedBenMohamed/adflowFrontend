import { generalSettingsStore } from '@/app';
import { Department } from '@/modules/settings';
import { Currency, User, type Optional } from '@/shared';
import { createColumnHelper, type CellContext, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadTitleCellWithToggle, RowTitleCell } from '../../../components';
import { formatQuantityAmountWithCurrency } from '../../../helpers';
import { ReportsColumnsIds, ScheduleReportType, type QuantityAmount } from '../../../models';
import type { GeneralReportSyntheticRow, ScheduleReportSyntheticRow } from '../../../types';

const getCardsCellCb =
  (currency: Currency) =>
  (info: CellContext<ScheduleReportSyntheticRow, Optional<QuantityAmount>>): string =>
    formatQuantityAmountWithCurrency({
      currency,
      qAmount: info.getValue(),
    });

export const useGetScheduleReportColumns = (reportType: ScheduleReportType) => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_schedule_report_columns',
  });

  return useMemo(() => {
    const currency = generalSettingsStore.accountSettings?.currency ?? Currency.USD;
    const columnHelper = createColumnHelper<ScheduleReportSyntheticRow>();

    return [
      columnHelper.display({
        id: ReportsColumnsIds.TITLE,
        header: info => {
          const title = reportType === ScheduleReportType.DEPARTMENT ? t('groups') : t('users');

          return <HeadTitleCellWithToggle title={title} table={info.table} />;
        },
        cell: info => <RowTitleCell row={info.row} />,
        meta: {
          excelValue: (row: GeneralReportSyntheticRow) =>
            `${row.originalObject instanceof User ? row.originalObject.fullName : row.originalObject instanceof Department ? row.originalObject.name : ''}`,
        },
      }),

      columnHelper.accessor('originalRow.sold', {
        header: t('sold'),
        cell: getCardsCellCb(currency),
      }),

      columnHelper.accessor('originalRow.all', {
        header: t('total'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.scheduled', {
        header: t('scheduled'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.confirmed', {
        header: t('confirmed'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.completed', {
        header: t('completed'),
        cell: info => info.getValue(),
      }),

      columnHelper.accessor('originalRow.canceled', {
        header: t('cancelled'),
        cell: info => info.getValue(),
      }),
    ] as ColumnDef<ScheduleReportSyntheticRow, unknown>[];
  }, [reportType, t]);
};
