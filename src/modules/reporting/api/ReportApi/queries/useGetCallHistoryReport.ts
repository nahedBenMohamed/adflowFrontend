import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { CallHistoryReportFilterDto } from '../../dtos';
import { CALL_HISTORY_REPORT_LIMIT, reportApi } from '../ReportApi';

export const useGetCallHistoryReport = ({
  page,
  filter,
}: {
  page: number;
  filter: CallHistoryReportFilterDto;
}) => {
  const offset = (page - 1) * CALL_HISTORY_REPORT_LIMIT;

  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: REPORTING_QUERY_KEYS.callHistoryReport({ offset, filter }),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getCallHistoryReport({ filter, offset }),
  });
};
