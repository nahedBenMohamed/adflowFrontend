import { queryClient } from '@/index';
import type { InfiniteData } from '@tanstack/react-query';
import type { ChatMessage, ChatMessagesResult } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const addChatMessageToCache = async ({
  chatId,
  message,
}: {
  chatId: number;
  message: ChatMessage;
}): Promise<void> => {
  queryClient.setQueryData<InfiniteData<ChatMessagesResult>>(
    MULTICHAT_QUERY_KEYS.messages(chatId),
    prev => {
      return prev
        ? {
            pages: prev.pages.map<ChatMessagesResult>((p, idx) => ({
              messages: idx === 0 ? [message, ...p.messages] : p.messages,
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
