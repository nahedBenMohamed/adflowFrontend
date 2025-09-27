import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RowParticipantCellSwitch, RowRecordCell } from '../../../components';
import { ReportsColumnsIds } from '../../../models';
import type { CallHistoryReportSyntheticRow } from '../../../types';

export const useGetCallHistoryReportColumns = (
  currentPageEncodedUrl: string
): ColumnDef<CallHistoryReportSyntheticRow, unknown>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_calls_history_report_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<CallHistoryReportSyntheticRow>();

    return [
      columnHelper.accessor('originalRow.createdAt', {
        id: ReportsColumnsIds.TITLE,
        header: t('timestamps'),
        cell: info => {
          const createdAt = info.getValue();

          return createdAt.toString();
        },
      }),

      columnHelper.display({
        id: 'caller',
        header: t('caller'),
        cell: info => {
          const { userId, direction, status, entityInfo, phoneNumber } =
            info.row.original.originalRow;

          return (
            <RowParticipantCellSwitch
              userId={userId}
              status={status}
              participant="caller"
              direction={direction}
              entityInfo={entityInfo}
              phoneNumber={phoneNumber}
              currentPathname={currentPageEncodedUrl}
            />
          );
        },
      }),

      columnHelper.display({
        id: 'callee',
        header: t('callee'),
        cell: info => {
          const { userId, direction, status, entityInfo, phoneNumber } =
            info.row.original.originalRow;

          return (
            <RowParticipantCellSwitch
              userId={userId}
              status={status}
              participant="callee"
              direction={direction}
              entityInfo={entityInfo}
              phoneNumber={phoneNumber}
              currentPathname={currentPageEncodedUrl}
            />
          );
        },
      }),

      columnHelper.display({
        id: 'duration',
        header: t('result'),
        cell: info => {
          const { recordUrl, duration, direction, userId, entityInfo } =
            info.row.original.originalRow;

          return (
            <RowRecordCell
              userId={userId}
              duration={duration}
              direction={direction}
              recordUrl={recordUrl}
              entityName={entityInfo?.name}
            />
          );
        },
      }),
    ] as ColumnDef<CallHistoryReportSyntheticRow, unknown>[];
  }, [currentPageEncodedUrl, t]);
};
