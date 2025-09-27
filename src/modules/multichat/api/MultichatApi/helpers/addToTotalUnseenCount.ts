import { queryClient } from '@/index';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const addToTotalUnseenCount = async (add: number): Promise<void> => {
  queryClient.setQueryData<number>(MULTICHAT_QUERY_KEYS.unseenCount(), prev =>
    Math.max(Number(prev ?? 0) + add, 0)
  );
};
