import type { Optional } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import {
  type ChatProvider,
  ChatProviderTransport,
  ChatProviderType,
} from '../../../shared/lib/models';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatProviderApi } from '../ChatProviderApi';

export const useGetExternalChatProviders = (): Optional<ChatProvider[]> => {
  const { data: providers } = useQuery({
    staleTime: 2 * 60 * 1000,
    queryKey: MULTICHAT_QUERY_KEYS.providers(),
    queryFn: chatProviderApi.getChatProviders,
    select: (providers: ChatProvider[]) =>
      providers?.filter(
        p => p.transport !== ChatProviderTransport.AMWORK && p.type !== ChatProviderType.AMWORK
      ),
  });

  return providers;
};
