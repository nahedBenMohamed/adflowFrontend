import { queryClient } from '@/index';
import type { ChatProvider } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const addToProviderUnseenCount = async ({
  providerId,
  add,
}: {
  providerId: number;
  add: number;
}): Promise<void> => {
  queryClient.setQueryData<ChatProvider[]>(MULTICHAT_QUERY_KEYS.providers(), prev =>
    prev
      ? prev.map<ChatProvider>(p =>
          p.id === providerId ? { ...p, unseenCount: p.unseenCount + add } : p
        )
      : []
  );
};
