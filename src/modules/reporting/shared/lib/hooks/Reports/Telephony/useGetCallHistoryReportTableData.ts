import { userStore } from '@/app';
import { useMemo } from 'react';
import type { CallHistoryReport } from '../../../models';
import type { CallHistoryReportSyntheticRow } from '../../../types';

export const useGetCallHistoryReportTableData = (
  callHistoryReport?: CallHistoryReport
): CallHistoryReportSyntheticRow[] =>
  useMemo<CallHistoryReportSyntheticRow[]>(() => {
    if (!callHistoryReport) return [];

    return callHistoryReport.calls.map<CallHistoryReportSyntheticRow>(r => ({
      subRows: [],
      type: 'user',
      originalRow: r,
      originalObject: userStore.getById(r.userId),
    }));
  }, [callHistoryReport]);
