import { useMemo } from 'react';
import { CustomerReportType, type CustomerReport } from '../../../models';
import type { CustomerReportSyntheticRow } from '../../../types';

export const useGetCustomerReportTableData = ({
  customerReport,
}: {
  customerReport?: CustomerReport;
  reportType: CustomerReportType;
}): CustomerReportSyntheticRow[] =>
  useMemo<CustomerReportSyntheticRow[]>(() => {
    if (!customerReport) return [];

    const rows = customerReport.rows.map<CustomerReportSyntheticRow>(r => ({
      type: 'user',
      originalRow: r,
      originalObject: r.ownerName,
    }));

    return rows.length > 0 ? rows : [];
  }, [customerReport]);
