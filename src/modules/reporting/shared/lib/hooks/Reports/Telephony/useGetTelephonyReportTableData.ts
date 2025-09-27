import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { useMemo } from 'react';
import { TelephonyReportType, type TelephonyReport } from '../../../models';
import { type TelephonyReportSyntheticRow } from '../../../types';

export const useGetTelephonyReportTableData = ({
  reportType,
  telephonyReport,
}: {
  reportType: TelephonyReportType;
  telephonyReport?: TelephonyReport;
}): TelephonyReportSyntheticRow[] =>
  useMemo<TelephonyReportSyntheticRow[]>(() => {
    if (!telephonyReport) return [];

    let finalRows: TelephonyReportSyntheticRow[] = [];

    switch (reportType) {
      case TelephonyReportType.TELEPHONY_GROUPS: {
        const rows: TelephonyReportSyntheticRow[] = [];

        const withoutGroupRow = telephonyReport.findDepartmentRowById(0);

        if (withoutGroupRow)
          rows.push({
            type: 'group',
            originalRow: withoutGroupRow,
            subRows: [],
          });

        departmentsSettingsStore.departments.forEach(d => {
          const departmentRow = telephonyReport.findDepartmentRowById(d.id);

          if (!departmentRow) return;

          const subdepartmentsRows: TelephonyReportSyntheticRow[] = [];

          d.subordinates.forEach(s => {
            const subdepartmentRow = telephonyReport.findDepartmentRowById(s.id);

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

      case TelephonyReportType.TELEPHONY_USERS: {
        const departmentsRows: TelephonyReportSyntheticRow[] = [];
        const usersWithoutDepartmentRows: TelephonyReportSyntheticRow[] = [];

        userStore.activeUsersWithoutDepartments.forEach(u => {
          const userRow = telephonyReport.findUserRowById(u.id);

          if (!userRow) return;

          usersWithoutDepartmentRows.push({
            type: 'user',
            originalObject: u,
            originalRow: userRow,
            subRows: [],
          });
        });

        departmentsSettingsStore.departments.forEach(d => {
          const departmentRow = telephonyReport.findDepartmentRowById(d.id);

          if (!departmentRow) return;

          const subdepartmentsRows: TelephonyReportSyntheticRow[] = [];
          const departmentUsersRows: TelephonyReportSyntheticRow[] = [];

          d.subordinates.forEach(s => {
            const subdepartmentRow = telephonyReport.findDepartmentRowById(s.id);

            if (!subdepartmentRow) return;

            const subdepartmentUsersRows: TelephonyReportSyntheticRow[] = [];

            userStore.getDepartmentActiveUsers(s.id).forEach(u => {
              const userRow = telephonyReport.findUserRowById(u.id);

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
            const userRow = telephonyReport.findUserRowById(u.id);

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

        break;
      }
    }

    const totalRow: TelephonyReportSyntheticRow = {
      type: 'total',
      originalRow: telephonyReport.total,
      subRows: [],
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [reportType, telephonyReport]);
