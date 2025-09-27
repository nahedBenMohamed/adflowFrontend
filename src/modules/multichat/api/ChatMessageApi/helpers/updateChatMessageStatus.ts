import { queryClient } from '@/index';
import type { ChatMessage, ChatMessageStatus } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';

export const updateChatMessageStatus = async ({
  chatId,
  messageId,
  status,
}: {
  chatId: number;
  messageId: number;
  status: ChatMessageStatus;
}): Promise<ChatMessage> => {
  return await queryClient.fetchQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: MULTICHAT_QUERY_KEYS.message(chatId, messageId),
    queryFn: () => chatMessageApi.updateChatMessageStatus({ chatId, messageId, status }),
  });
};
