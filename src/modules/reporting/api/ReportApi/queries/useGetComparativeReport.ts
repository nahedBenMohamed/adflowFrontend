import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ComparativeReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetComparativeReport = (filter: ComparativeReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.comparativeReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getComparativeReport(filter),
  });
