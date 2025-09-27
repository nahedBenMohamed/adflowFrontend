import { useQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatProviderApi } from '../ChatProviderApi';

// default stale time – 2 minutes
export const useGetChatProviders = (staleTime: number = 2 * 60 * 1000) =>
  useQuery({
    staleTime,
    queryKey: MULTICHAT_QUERY_KEYS.providers(),
    queryFn: chatProviderApi.getChatProviders,
  });
