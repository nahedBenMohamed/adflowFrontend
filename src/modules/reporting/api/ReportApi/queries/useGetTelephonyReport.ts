import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { TelephonyReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetTelephonyReport = (filter: TelephonyReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.telephonyReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getTelephonyReport(filter),
  });
