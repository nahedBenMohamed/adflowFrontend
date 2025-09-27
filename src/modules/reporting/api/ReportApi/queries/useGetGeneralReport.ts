import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { GeneralReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetGeneralReport = (filter: GeneralReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.generalReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getGeneralReport(filter),
  });
