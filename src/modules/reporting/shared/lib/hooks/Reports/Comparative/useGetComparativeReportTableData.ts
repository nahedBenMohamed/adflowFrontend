import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { useMemo } from 'react';
import type { ComparativeReport } from '../../../models';
import type { ComparativeReportSyntheticRow } from '../../../types';

export const useGetComparativeReportTableData = (
  comparativeReport?: ComparativeReport
): ComparativeReportSyntheticRow[] =>
  useMemo<ComparativeReportSyntheticRow[]>(() => {
    if (!comparativeReport) return [];

    const departmentsRows: ComparativeReportSyntheticRow[] = [];
    const usersWithoutDepartmentRows: ComparativeReportSyntheticRow[] = [];

    userStore.activeUsersWithoutDepartments.forEach(u => {
      const userRow = comparativeReport.findUserRowById(u.id);

      if (!userRow) return;

      usersWithoutDepartmentRows.push({
        type: 'user',
        originalObject: u,
        originalRow: userRow,
        subRows: [],
      });
    });

    departmentsSettingsStore.departments.forEach(d => {
      const departmentRow = comparativeReport.findDepartmentRowById(d.id);

      if (!departmentRow) return;

      const subdepartmentsRows: ComparativeReportSyntheticRow[] = [];
      const departmentUsersRows: ComparativeReportSyntheticRow[] = [];

      d.subordinates.forEach(s => {
        const subdepartmentRow = comparativeReport.findDepartmentRowById(s.id);

        if (!subdepartmentRow) return;

        const subdepartmentUsersRows: ComparativeReportSyntheticRow[] = [];

        userStore.getDepartmentActiveUsers(s.id).forEach(u => {
          const userRow = comparativeReport.findUserRowById(u.id);

          if (!userRow) return;

          subdepartmentUsersRows.push({
            type: 'user',
            originalObject: u,
            originalRow: userRow,
            subRows: [],
          });
        });

        subdepartmentsRows.push({
          originalObject: s,
          type: 'subgroup',
          originalRow: subdepartmentRow,
          subRows: subdepartmentUsersRows,
        });
      });

      userStore.getDepartmentActiveUsers(d.id).forEach(u => {
        const userRow = comparativeReport.findUserRowById(u.id);

        if (!userRow) return;

        departmentUsersRows.push({
          type: 'user',
          originalObject: u,
          originalRow: userRow,
          subRows: [],
        });
      });

      departmentsRows.push({
        originalObject: d,
        type: 'group',
        originalRow: departmentRow,
        subRows: [...departmentUsersRows, ...subdepartmentsRows],
      });
    });

    const finalRows = [...usersWithoutDepartmentRows, ...departmentsRows];

    const totalRow: ComparativeReportSyntheticRow = {
      type: 'total',
      originalRow: comparativeReport.total,
      subRows: [],
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [comparativeReport]);
