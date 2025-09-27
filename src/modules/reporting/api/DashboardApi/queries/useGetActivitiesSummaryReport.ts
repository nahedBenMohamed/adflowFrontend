import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ReportFilter } from '../../dtos';
import { dashboardApi } from '../DashboardApi';

export const useGetActivitiesSummaryReport = ({
  etId,
  filter,
  refetchInterval,
}: {
  etId: number;
  filter: ReportFilter;
  refetchInterval?: number;
}) => {
  return useQuery({
    refetchInterval,
    placeholderData: keepPreviousData,
    queryKey: [...REPORTING_QUERY_KEYS.activitiesSummaryReport({ etId, filter })],
    queryFn: () => dashboardApi.getActivitiesSummaryReport({ entityTypeId: etId, filter }),
  });
};
