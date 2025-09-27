import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { SalesPipelineFilter } from '../../../shared';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import { dashboardApi } from '../DashboardApi';

export const useGetPipelineReport = ({
  etId,
  filter,
}: {
  etId: number;
  filter: SalesPipelineFilter;
}) =>
  useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => dashboardApi.getPipelineReport({ etId, filter }),
    queryKey: REPORTING_QUERY_KEYS.pipelineReport({ etId, filter }),
  });
