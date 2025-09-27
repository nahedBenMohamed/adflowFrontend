import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleReportType, type ScheduleReport } from '../../../models';
import type { ScheduleReportSyntheticRow } from '../../../types';

export const useGetScheduleReportTableData = ({
  reportType,
  scheduleReport,
}: {
  reportType: ScheduleReportType;
  scheduleReport?: ScheduleReport;
}): ScheduleReportSyntheticRow[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_general_report_columns',
  });

  return useMemo<ScheduleReportSyntheticRow[]>(() => {
    if (!scheduleReport) return [];

    let finalRows: ScheduleReportSyntheticRow[] = [];

    switch (reportType) {
      case ScheduleReportType.DEPARTMENT: {
        const rows: ScheduleReportSyntheticRow[] = [];

        const withoutGroupRow = scheduleReport.findDepartmentRowById(0);

        if (withoutGroupRow)
          rows.push({
            type: 'group',
            originalRow: withoutGroupRow,
            subRows: [],
          });

        departmentsSettingsStore.departments.forEach(d => {
          const departmentRow = scheduleReport.findDepartmentRowById(d.id);

          if (!departmentRow) return;

          const subdepartmentsRows: ScheduleReportSyntheticRow[] = [];

          d.subordinates.forEach(s => {
            const subdepartmentRow = scheduleReport.findDepartmentRowById(s.id);

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

      case ScheduleReportType.CLIENT: {
        finalRows = scheduleReport.rows.map<ScheduleReportSyntheticRow>(r => ({
          type: 'user',
          originalRow: r,
          originalObject: r.ownerName || t('undefined_client'),
        }));

        break;
      }

      default: {
        finalRows = scheduleReport.rows.map<ScheduleReportSyntheticRow>(r => ({
          type: 'user',
          originalRow: r,
          ...(r.ownerId && { originalObject: userStore.getById(r.ownerId) }),
        }));
      }
    }

    const totalRow: ScheduleReportSyntheticRow = {
      type: 'total',
      originalRow: scheduleReport.total,
    };

    return finalRows.length > 0 ? [...finalRows, totalRow] : [];
  }, [reportType, scheduleReport, t]);
};
