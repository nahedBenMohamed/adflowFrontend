import { PagingMeta } from '@/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantApi } from '../VoximplantApi';

export const useGetVoximplantCalls = () =>
  useInfiniteQuery({
    queryKey: TELEPHONY_QUERY_KEYS.calls(),
    initialPageParam: new PagingMeta(0, 0),
    queryFn: ({ pageParam }) => voximplantApi.getVoximplantCalls(pageParam.offset),
    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset ? undefined : lastPage.meta;
    },
  });
