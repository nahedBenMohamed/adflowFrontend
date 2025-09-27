import { queryClient } from '@/index';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const invalidateChatProvidersInCache = () =>
  queryClient.refetchQueries({ queryKey: MULTICHAT_QUERY_KEYS.providers() });
