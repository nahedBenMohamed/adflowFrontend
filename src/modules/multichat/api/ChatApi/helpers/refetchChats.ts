import { queryClient } from '@/index';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const refetchChats = (providerId: number): Promise<void> =>
  queryClient.refetchQueries({ queryKey: MULTICHAT_QUERY_KEYS.chats(providerId) });
