import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ReportFilter } from '../../dtos';
import { dashboardApi } from '../DashboardApi';

export const useGetSalesPlanReport = ({
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
    queryKey: [...REPORTING_QUERY_KEYS.salePlanReport({ etId, filter })],
    placeholderData: keepPreviousData,
    queryFn: () => dashboardApi.getSalesPlanReport({ entityTypeId: etId, filter }),
  });
};
