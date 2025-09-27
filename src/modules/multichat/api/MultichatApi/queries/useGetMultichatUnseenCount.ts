import { useQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { multichatApi } from '../MultichatApi';

export const useGetMultichatUnseenCount = () =>
  useQuery({
    queryKey: MULTICHAT_QUERY_KEYS.unseenCount(),
    initialData: 0,
    queryFn: multichatApi.getUnseenCount,
  });
