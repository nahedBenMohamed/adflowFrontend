import { queryClient } from '@/index';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const deleteChatMessagesCache = async (chatId: number): Promise<void> => {
  queryClient.removeQueries({ queryKey: MULTICHAT_QUERY_KEYS.messages(chatId) });
};
