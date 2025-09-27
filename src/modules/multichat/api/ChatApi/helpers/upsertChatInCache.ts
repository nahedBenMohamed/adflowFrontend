import { queryClient } from '@/index';
import type { Optional } from '@/shared';
import type { InfiniteData, Updater } from '@tanstack/react-query';
import type { Chat } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const upsertChatInCache = async (chat: Chat): Promise<void> => {
  const updater: Updater<Optional<InfiniteData<Chat[]>>, Optional<InfiniteData<Chat[]>>> = (
    prev: Optional<InfiniteData<Chat[]>>
  ) => {
    if (prev) {
      const alreadyExists = prev.pages.find(p => p.find(c => c.id === chat.id));

      if (alreadyExists) {
        return {
          pages: prev.pages.map<Chat[]>(p => p.map<Chat>(c => (c.id === chat.id ? chat : c))),
          pageParams: prev.pageParams,
        };
      }

      return {
        pages: prev.pages.map<Chat[]>((p, idx) => (idx === 0 ? [chat, ...p] : p)),
        pageParams: prev.pageParams,
      };
    }

    return {
      pages: [],
      pageParams: [],
    };
  };

  // update cache in all chats panel
  queryClient.setQueryData<InfiniteData<Chat[]>>(MULTICHAT_QUERY_KEYS.chats(undefined), updater);

  // update cache in specific provider panel
  queryClient.setQueryData<InfiniteData<Chat[]>>(
    MULTICHAT_QUERY_KEYS.chats(chat.providerId),
    updater
  );
};
