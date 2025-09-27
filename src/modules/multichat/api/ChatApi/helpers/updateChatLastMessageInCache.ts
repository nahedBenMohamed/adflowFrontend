import { queryClient } from '@/index';
import { arraysShallowEqual, type Optional } from '@/shared';
import type { InfiniteData, Updater } from '@tanstack/react-query';
import type { Chat, ChatMessage, FindChatsFullResult } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const updateChatLastMessageInCache = async ({
  providerId,
  chatId,
  message,
  incrementUnseenCount = false,
}: {
  providerId: Optional<number>;
  chatId: number;
  message: ChatMessage;
  incrementUnseenCount?: boolean;
}): Promise<void> => {
  const updater: Updater<Optional<InfiniteData<Chat[]>>, Optional<InfiniteData<Chat[]>>> = (
    prev: Optional<InfiniteData<Chat[]>>
  ) =>
    prev
      ? {
          pages: prev.pages.map<Chat[]>(p =>
            p.map<Chat>(c =>
              c.id === chatId
                ? {
                    ...c,
                    lastMessage: message,
                    updatedAt: message.createdAt,
                    unseenCount: incrementUnseenCount ? c.unseenCount + 1 : c.unseenCount,
                  }
                : c
            )
          ),
          pageParams: prev.pageParams,
        }
      : {
          pages: [],
          pageParams: [],
        };

  const findUpdater: Updater<
    Optional<InfiniteData<FindChatsFullResult>>,
    Optional<InfiniteData<FindChatsFullResult>>
  > = (prev: Optional<InfiniteData<FindChatsFullResult>>) =>
    prev
      ? {
          pages: prev.pages.map<FindChatsFullResult>(p => ({
            ...p,
            chats: p.chats.map<Chat>(c =>
              c.id === chatId
                ? {
                    ...c,
                    lastMessage: message,
                    updatedAt: message.createdAt,
                    unseenCount: incrementUnseenCount ? c.unseenCount + 1 : c.unseenCount,
                  }
                : c
            ),
          })),
          pageParams: prev.pageParams,
        }
      : {
          pages: [],
          pageParams: [],
        };

  // update cache in all chats panel
  queryClient.setQueryData<InfiniteData<Chat[]>>(MULTICHAT_QUERY_KEYS.chats(undefined), updater);

  // update cache in find chats panel
  // so that when search is active and we send a new message, it will be shown in the list
  queryClient.setQueriesData<InfiniteData<FindChatsFullResult>>(
    {
      predicate: ({ queryKey }) =>
        arraysShallowEqual({
          arr1: queryKey.slice(0, 5),
          arr2: MULTICHAT_QUERY_KEYS.findFullChats().slice(0, 5),
        }),
    },
    findUpdater
  );

  // update cache in specific provider panel
  if (providerId) {
    queryClient.setQueryData<InfiniteData<Chat[]>>(MULTICHAT_QUERY_KEYS.chats(providerId), updater);

    queryClient.setQueriesData<InfiniteData<FindChatsFullResult>>(
      {
        predicate: ({ queryKey }) =>
          arraysShallowEqual({
            arr1: queryKey.slice(0, 5),
            arr2: MULTICHAT_QUERY_KEYS.findFullChats({ providerId }).slice(0, 5),
          }),
      },
      findUpdater
    );
  }
};
