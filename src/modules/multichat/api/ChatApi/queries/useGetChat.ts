import { useQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';

export const useGetChat = (chatId: number) =>
  useQuery({
    queryKey: MULTICHAT_QUERY_KEYS.chat(chatId),
    queryFn: () => chatApi.getChat(chatId),
  });
