import { useQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';

export const useGetChatExists = (entityId: number) =>
  useQuery({
    queryKey: MULTICHAT_QUERY_KEYS.chatExists(entityId),
    queryFn: () => chatApi.getChatExists(entityId),
  });
