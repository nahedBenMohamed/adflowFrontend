import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ProjectEntitiesReportFilterDto } from '../../dtos';
import { reportApi } from '../ReportApi';

export const useGetProjectEntitiesReport = (filter: ProjectEntitiesReportFilterDto) =>
  useQuery({
    queryKey: REPORTING_QUERY_KEYS.projectEntitiesReport(filter),
    placeholderData: keepPreviousData,
    queryFn: () => reportApi.getProjectEntitiesReport(filter),
  });
