import { userStore } from '@/app';
import { useMemo } from 'react';
import type { ProjectTaskUserReport } from '../../../models';
import type { ProjectTaskUserReportSyntheticRow } from '../../../types/Reports/Projects/ProjectTaskUserReportSyntheticRow';

export const useGetProjectTaskUserReportTableData = (
  taskUserReport?: ProjectTaskUserReport
): ProjectTaskUserReportSyntheticRow[] =>
  useMemo<ProjectTaskUserReportSyntheticRow[]>(() => {
    if (!taskUserReport) return [];

    const finalRows = taskUserReport.rows.map<ProjectTaskUserReportSyntheticRow>(r => ({
      type: 'user',
      originalRow: r,
      originalObject: userStore.getById(r.userId),
    }));

    const totalRow: ProjectTaskUserReportSyntheticRow = {
      type: 'total',
      originalRow: taskUserReport.total,
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [taskUserReport]);
