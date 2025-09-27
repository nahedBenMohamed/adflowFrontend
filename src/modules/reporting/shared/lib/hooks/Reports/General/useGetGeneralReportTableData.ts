import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { useMemo } from 'react';
import { GeneralReportType, type GeneralReport } from '../../../models';
import type { GeneralReportSyntheticRow } from '../../../types';

export const useGetGeneralReportTableData = ({
  reportType,
  generalReport,
}: {
  reportType: GeneralReportType;
  generalReport?: GeneralReport;
}): GeneralReportSyntheticRow[] =>
  useMemo<GeneralReportSyntheticRow[]>(() => {
    if (!generalReport) return [];

    let finalRows: GeneralReportSyntheticRow[] = [];

    switch (reportType) {
      case GeneralReportType.DEPARTMENT: {
        const rows: GeneralReportSyntheticRow[] = [];

        const withoutGroupRow = generalReport.findDepartmentRowById(0);

        if (withoutGroupRow)
          rows.push({
            type: 'group',
            originalRow: withoutGroupRow,
            subRows: [],
          });

        departmentsSettingsStore.departments.forEach(d => {
          const departmentRow = generalReport.findDepartmentRowById(d.id);

          if (!departmentRow) return;

          const subdepartmentsRows: GeneralReportSyntheticRow[] = [];

          d.subordinates.forEach(s => {
            const subdepartmentRow = generalReport.findDepartmentRowById(s.id);

            if (!subdepartmentRow) return;

            subdepartmentsRows.push({
              originalObject: s,
              type: 'subgroup',
              originalRow: subdepartmentRow,
              subRows: [],
            });
          });

          rows.push({
            originalObject: d,
            type: 'group',
            originalRow: departmentRow,
            subRows: subdepartmentsRows,
          });
        });

        finalRows = rows;

        break;
      }

      case GeneralReportType.RATING: {
        finalRows = generalReport.users
          .filter(r => r.ownerId !== 0)
          .map<GeneralReportSyntheticRow>(r => ({
            type: 'user',
            originalRow: r,
            originalObject: userStore.getById(r.ownerId),
            subRows: [],
          }));

        const emptyUserRow = generalReport.findUserRowById(0);

        if (emptyUserRow)
          finalRows.push({
            type: 'empty-user',
            originalRow: emptyUserRow,
            subRows: [],
          });

        break;
      }

      case GeneralReportType.USER: {
        const departmentsRows: GeneralReportSyntheticRow[] = [];
        const usersWithoutDepartmentRows: GeneralReportSyntheticRow[] = [];

        userStore.activeUsersWithoutDepartments.forEach(u => {
          const userRow = generalReport.findUserRowById(u.id);

          if (!userRow) return;

          usersWithoutDepartmentRows.push({
            type: 'user',
            originalObject: u,
            originalRow: userRow,
            subRows: [],
          });
        });

        departmentsSettingsStore.departments.forEach(d => {
          const departmentRow = generalReport.findDepartmentRowById(d.id);

          if (!departmentRow) return;

          const subdepartmentsRows: GeneralReportSyntheticRow[] = [];
          const departmentUsersRows: GeneralReportSyntheticRow[] = [];

          d.subordinates.forEach(s => {
            const subdepartmentRow = generalReport.findDepartmentRowById(s.id);

            if (!subdepartmentRow) return;

            const subdepartmentUsersRows: GeneralReportSyntheticRow[] = [];

            userStore.getDepartmentActiveUsers(s.id).forEach(u => {
              const userRow = generalReport.findUserRowById(u.id);

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
            const userRow = generalReport.findUserRowById(u.id);

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

        finalRows = [...usersWithoutDepartmentRows, ...departmentsRows];

        const emptyUserRow = generalReport.findUserRowById(0);

        if (emptyUserRow)
          finalRows.push({
            type: 'empty-user',
            originalRow: emptyUserRow,
            subRows: [],
          });

        break;
      }
    }

    const totalRow: GeneralReportSyntheticRow = {
      type: 'total',
      originalRow: generalReport.total,
      subRows: [],
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [reportType, generalReport]);
