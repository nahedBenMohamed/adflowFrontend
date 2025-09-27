import { queryClient } from '@/index';
import type { Chat } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';

export const getChat = async (chatId: number): Promise<Chat> => {
  return await queryClient.fetchQuery({
    queryKey: MULTICHAT_QUERY_KEYS.chat(chatId),
    queryFn: () => chatApi.getChat(chatId),
  });
};
