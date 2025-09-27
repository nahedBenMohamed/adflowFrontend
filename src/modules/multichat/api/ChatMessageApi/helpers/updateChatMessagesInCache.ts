import { queryClient } from '@/index';
import type { InfiniteData } from '@tanstack/react-query';
import type { ChatMessage, ChatMessagesResult } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const updateChatMessagesInCache = async ({
  chatId,
  messages,
}: {
  chatId: number;
  messages: ChatMessage[];
}): Promise<void> => {
  queryClient.setQueryData<InfiniteData<ChatMessagesResult>>(
    MULTICHAT_QUERY_KEYS.messages(chatId),
    prev => {
      return prev
        ? {
            pages: prev.pages.map<ChatMessagesResult>(p => ({
              messages: p.messages.map<ChatMessage>(m => messages.find(um => um.id === m.id) ?? m),
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
