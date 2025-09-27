import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ReportFilter } from '../../dtos';
import { dashboardApi } from '../DashboardApi';

export const useGetEntitySummaryReport = ({
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
    queryKey: [...REPORTING_QUERY_KEYS.entitySummaryReport({ etId, filter })],
    placeholderData: keepPreviousData,
    queryFn: () => dashboardApi.getEntitySummaryReport({ entityTypeId: etId, filter }),
  });
};
