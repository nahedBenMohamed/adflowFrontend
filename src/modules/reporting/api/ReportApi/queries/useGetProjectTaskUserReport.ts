import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ProjectTaskUserReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetTaskUserReport = (filter: ProjectTaskUserReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.projectTaskUserReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getProjectTaskUserReport(filter),
  });
