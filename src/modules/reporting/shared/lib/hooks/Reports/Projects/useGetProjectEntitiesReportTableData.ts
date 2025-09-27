import { useMemo } from 'react';
import type { ProjectEntitiesReport } from '../../../models';
import type { ProjectEntitiesReportSyntheticRow } from '../../../types';

export const useGetProjectEntitiesReportTableData = (
  entitiesReport?: ProjectEntitiesReport
): ProjectEntitiesReportSyntheticRow[] =>
  useMemo<ProjectEntitiesReportSyntheticRow[]>(() => {
    if (!entitiesReport) return [];

    const finalRows = entitiesReport.rows.map<ProjectEntitiesReportSyntheticRow>(r => ({
      type: 'user',
      originalRow: r,
    }));

    const totalRow: ProjectEntitiesReportSyntheticRow = {
      type: 'total',
      originalRow: entitiesReport.total,
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [entitiesReport]);
