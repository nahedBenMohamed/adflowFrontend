import { queryClient } from '@/index';
import type { InfiniteData } from '@tanstack/react-query';
import type { ChatMessagesResult } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const deleteChatMessageInCache = async ({
  chatId,
  messageId,
}: {
  chatId: number;
  messageId: number;
}): Promise<void> => {
  queryClient.setQueryData<InfiniteData<ChatMessagesResult>>(
    MULTICHAT_QUERY_KEYS.messages(chatId),
    prev => {
      return prev
        ? {
            pages: prev.pages.map<ChatMessagesResult>(p => ({
              messages: p.messages.filter(m => m.id !== messageId),
              meta: p.meta,
            })),
            pageParams: prev.pageParams,
          }
        : {
            pages: [],
            pageParams: [],
          };
    }
  );
};
