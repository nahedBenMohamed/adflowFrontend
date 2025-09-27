import { queryClient } from '@/index';
import type { ChatMessage } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';

export const getChatMessage = async ({
  chatId,
  messageId,
}: {
  chatId: number;
  messageId: number;
}): Promise<ChatMessage> => {
  return await queryClient.fetchQuery({
    queryKey: MULTICHAT_QUERY_KEYS.message(chatId, messageId),
    queryFn: () => chatMessageApi.getChatMessage({ chatId, messageId }),
  });
};
