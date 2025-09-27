import { queryClient } from '@/index';
import type { Optional } from '@/shared';
import type { InfiniteData, Updater } from '@tanstack/react-query';
import type { Chat } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const deleteChatInCache = async ({
  providerId,
  chatId,
}: {
  providerId: number;
  chatId: number;
}): Promise<void> => {
  const updater: Updater<Optional<InfiniteData<Chat[]>>, Optional<InfiniteData<Chat[]>>> = (
    prev: Optional<InfiniteData<Chat[]>>
  ) => {
    return prev
      ? {
          pages: prev.pages.map(p => p.filter(c => c.id !== chatId)),
          pageParams: prev.pageParams,
        }
      : {
          pages: [],
          pageParams: [],
        };
  };

  // update cache in all chats panel
  queryClient.setQueryData<InfiniteData<Chat[]>>(MULTICHAT_QUERY_KEYS.chats(undefined), updater);

  // update cache in specific provider panel
  queryClient.setQueryData<InfiniteData<Chat[]>>(MULTICHAT_QUERY_KEYS.chats(providerId), updater);
};
