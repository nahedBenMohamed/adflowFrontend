import { Department } from '@/modules/settings';
import { Optional, User } from '@/shared';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { type TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadTitleCellWithToggle, RowTitleCell } from '../../../components';
import { formatQuantityAmountWithMinutes } from '../../../helpers';
import { ReportsColumnsIds, TelephonyReportType, type QuantityAmount } from '../../../models';
import type { GeneralReportSyntheticRow, TelephonyReportSyntheticRow } from '../../../types';

const getCallCellCb =
  (t: TFunction) =>
  (info: CellContext<TelephonyReportSyntheticRow, unknown>): string =>
    formatQuantityAmountWithMinutes({
      qAmount: info.getValue() as Optional<QuantityAmount>,
      t,
    });

const GROUPS_OR_USERS_TYPE = [
  TelephonyReportType.TELEPHONY_GROUPS,
  TelephonyReportType.TELEPHONY_USERS,
];

export const useGetTelephonyReportColumns = ({
  reportType,
}: {
  reportType: TelephonyReportType;
}): ColumnDef<TelephonyReportSyntheticRow>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_general_report_columns',
  });

  return useMemo<ColumnDef<TelephonyReportSyntheticRow>[]>(() => {
    const defaultColumns: ColumnDef<TelephonyReportSyntheticRow>[] = [
      {
        id: ReportsColumnsIds.TITLE,
        header: info => {
          const title = GROUPS_OR_USERS_TYPE.includes(reportType) ? t('groups') : t('users');

          return <HeadTitleCellWithToggle title={title} table={info.table} />;
        },
        cell: info => <RowTitleCell row={info.row} />,
        meta: {
          excelValue: (row: GeneralReportSyntheticRow) =>
            `${row.originalObject instanceof User ? row.originalObject.fullName : row.originalObject instanceof Department ? row.originalObject.name : ''}`,
        },
      },
      {
        header: t('calls'),
        columns: [
          {
            id: 'calls-all',
            header: t('total'),
            accessorFn: r => r.originalRow.call?.all,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-all-average',
            header: t('average'),
            accessorFn: r => r.originalRow.call?.avgAll,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-incoming',
            header: t('incoming'),
            accessorFn: r => r.originalRow.call?.incoming,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-incoming-average',
            header: t('incoming_average'),
            accessorFn: r => r.originalRow.call?.avgIncoming,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-outgoing',
            header: t('outgoing'),
            accessorFn: r => r.originalRow.call?.outgoing,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-outgoing-average',
            header: t('outgoing_average'),
            accessorFn: r => r.originalRow.call?.avgOutgoing,
            cell: getCallCellCb(t),
          },
          {
            id: 'calls-missed',
            header: t('missed'),
            accessorFn: r => r.originalRow.call?.missed,
            cell: getCallCellCb(t),
          },
        ],
      },
    ];

    return defaultColumns;
  }, [t, reportType]);
};
