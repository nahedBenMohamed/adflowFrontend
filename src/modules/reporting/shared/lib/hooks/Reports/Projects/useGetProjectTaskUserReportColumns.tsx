import { Department } from '@/modules/settings';
import { Optional, Stage, User } from '@/shared';
import { createColumnHelper, type CellContext, type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RowTitleCell } from '../../../components';
import {
  calculatePercent,
  formatTaskCountPlannedTime,
  secondsToHoursAndMinutes,
} from '../../../helpers';
import { ReportsColumnsIds, type ProjectReportItem } from '../../../models';
import type { GeneralReportSyntheticRow, ProjectTaskUserReportSyntheticRow } from '../../../types';

const getReportCell =
  (t: TFunction) =>
  (info: CellContext<ProjectTaskUserReportSyntheticRow, Optional<ProjectReportItem>>): string =>
    formatTaskCountPlannedTime({
      taskCountPlannedTime: info.getValue(),
      t,
    });

export const useGetProjectTaskUserReportColumns = (
  stages?: Stage[]
): ColumnDef<ProjectTaskUserReportSyntheticRow>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_projects_report_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ProjectTaskUserReportSyntheticRow>();

    const stagesColumns = stages
      ? (stages.map(s =>
          columnHelper.accessor(r => r.originalRow.stages.find(st => st.stageId === s.id)?.item, {
            id: `${s.id}`,
            header: `${s.name}`,
            cell: getReportCell(t),
          })
        ) as ColumnDef<ProjectTaskUserReportSyntheticRow, unknown>[])
      : [];

    return [
      columnHelper.display({
        id: ReportsColumnsIds.TITLE,
        header: t('users'),
        cell: info => <RowTitleCell row={info.row} />,
        meta: {
          excelValue: (row: GeneralReportSyntheticRow) =>
            `${row.originalObject instanceof User ? row.originalObject.fullName : row.originalObject instanceof Department ? row.originalObject.name : ''}`,
        },
      }),

      columnHelper.accessor('originalRow.opened', {
        header: t('opened'),
        cell: getReportCell(t),
      }),

      columnHelper.accessor('originalRow.done', {
        header: t('done'),
        cell: getReportCell(t),
      }),

      columnHelper.accessor('originalRow.overdue', {
        header: t('overdue'),
        cell: getReportCell(t),
      }),

      ...stagesColumns,

      columnHelper.accessor('originalRow.planedTime', {
        header: t('planned'),
        cell: info => secondsToHoursAndMinutes({ seconds: info.getValue(), t }),
      }),

      columnHelper.accessor('originalRow.completionPercent', {
        header: t('completion_percent'),
        cell: info => `${calculatePercent({ currentValue: info.getValue(), totalValue: 1 })}%`,
      }),
    ] as ColumnDef<ProjectTaskUserReportSyntheticRow, unknown>[];
  }, [t, stages]);
};
