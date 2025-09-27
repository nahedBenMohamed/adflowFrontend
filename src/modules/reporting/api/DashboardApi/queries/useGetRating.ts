import { PagingMeta } from '@/shared';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { REPORTING_QUERY_KEYS } from '../../ReportingQueryKeys';
import type { ReportFilter } from '../../dtos';
import { dashboardApi } from '../DashboardApi';

export const useGetRating = ({
  etId,
  filter,
  refetchInterval,
}: {
  etId: number;
  filter: ReportFilter;
  refetchInterval?: number;
}) => {
  return useInfiniteQuery({
    refetchInterval,
    queryKey: [...REPORTING_QUERY_KEYS.rating({ etId, filter })],
    initialPageParam: new PagingMeta(0, 0),
    queryFn: ({ pageParam }) =>
      dashboardApi.getRating({ entityTypeId: etId, filter, offset: pageParam.offset }),
    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset ? undefined : lastPage.meta;
    },
    placeholderData: keepPreviousData,
  });
};
