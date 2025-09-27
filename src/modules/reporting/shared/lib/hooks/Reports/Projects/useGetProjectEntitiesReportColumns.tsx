import { routes } from '@/app';
import { ColoredBlock, type Optional, type Stage } from '@/shared';
import { createColumnHelper, type CellContext, type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RowTitleCell } from '../../../components';
import { calculatePercent, formatTaskCountPlannedTime } from '../../../helpers';
import type { ProjectEntitiesReport, ProjectReportItem } from '../../../models';
import type { ProjectEntitiesReportSyntheticRow } from '../../../types';

const getReportCell =
  (t: TFunction) =>
  (info: CellContext<ProjectEntitiesReportSyntheticRow, Optional<ProjectReportItem>>): string =>
    formatTaskCountPlannedTime({
      taskCountPlannedTime: info.getValue(),
      t,
    });

const StyledLink = styled(Link)`
  font-weight: 500;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

export const useGetProjectEntitiesReportColumns = ({
  entityTypeId,
  currentPageEncodedUrl,
  projectEntitiesReport,
  stages,
}: {
  entityTypeId: number;
  currentPageEncodedUrl: string;
  projectEntitiesReport?: ProjectEntitiesReport;
  stages?: Stage[];
}): ColumnDef<ProjectEntitiesReportSyntheticRow>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_projects_report_columns',
  });

  return useMemo(() => {
    const columnHelper = createColumnHelper<ProjectEntitiesReportSyntheticRow>();

    const stagesColumns = stages
      ? (stages.map(s =>
          columnHelper.accessor(
            r => r.originalRow.stages.find(rowStages => rowStages.stageId === s.id)?.item,
            {
              id: String(s.id),
              header: s.name,
              cell: getReportCell(t),
            }
          )
        ) as ColumnDef<ProjectEntitiesReportSyntheticRow, unknown>[])
      : [];

    const defaultColumns = [
      columnHelper.accessor('originalRow', {
        header: t('project_name'),
        cell: info => {
          const { type } = info.row.original;
          const { entityId, entityName } = info.getValue();

          return type === 'total' ? (
            <RowTitleCell row={info.row} />
          ) : (
            <StyledLink to={routes.card({ entityTypeId, entityId, from: currentPageEncodedUrl })}>
              {entityName}
            </StyledLink>
          );
        },
        meta: {
          excelValue: (row: ProjectEntitiesReportSyntheticRow) =>
            `${row.type === 'total' ? '' : row.originalRow.entityName}`,
        },
      }),

      columnHelper.accessor('originalRow.all', {
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

      columnHelper.accessor('originalRow.projectStageId', {
        header: t('stage'),
        cell: info => {
          const stageId = info.getValue();

          if (!stageId) return null;

          const stage = stages?.find(s => s.id === stageId);

          if (!stage) return null;

          const { name, color } = stage;

          return <ColoredBlock text={name} bgColor={color} />;
        },
      }),

      ...stagesColumns,

      columnHelper.accessor('originalRow.completionPercent', {
        header: t('completion_percent'),
        cell: info => `${calculatePercent({ currentValue: info.getValue(), totalValue: 1 })}%`,
      }),
    ] as ColumnDef<ProjectEntitiesReportSyntheticRow, unknown>[];

    if (projectEntitiesReport && projectEntitiesReport.meta.fields.length > 0)
      projectEntitiesReport.meta.fields.forEach(f =>
        defaultColumns.push({
          id: String(f.fieldId),
          header: f.fieldName,
          cell: info => info.getValue(),
          accessorFn: r =>
            r.originalRow.fields?.find(rowField => rowField.fieldId === f.fieldId)?.value ?? 0,
        })
      );

    return defaultColumns;
  }, [stages, currentPageEncodedUrl, entityTypeId, projectEntitiesReport, t]);
};
