import type { Optional } from '@/shared';
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
  type Updater,
} from '@tanstack/react-query';
import type { Chat, ChatMessageStatus } from '../../../shared';
import { addToProviderUnseenCount } from '../../ChatProviderApi/helpers/addToProviderUnseenCount';
import { addToTotalUnseenCount } from '../../MultichatApi/helpers/addToTotalUnseenCount';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';
import { updateChatMessagesInCache } from '../helpers/updateChatMessagesInCache';

export const useUpdateChatMessagesStatus = ({
  chatId,
  providerId,
  status,
}: {
  chatId: number;
  providerId: number;
  status: ChatMessageStatus;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageIds: number[]) =>
      chatMessageApi.updateChatMessagesStatus({ chatId, messageIds, status }),

    onSuccess: async (updatedMessages): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      addToTotalUnseenCount(-updatedMessages.length);
      addToProviderUnseenCount({ providerId, add: -updatedMessages.length });

      updateChatMessagesInCache({ chatId, messages: updatedMessages });

      const updater: Updater<Optional<InfiniteData<Chat[]>>, Optional<InfiniteData<Chat[]>>> = (
        prev: Optional<InfiniteData<Chat[]>>
      ) => {
        return prev
          ? {
              pages: prev.pages.map(p =>
                p.map(c =>
                  c.id === chatId
                    ? { ...c, unseenCount: c.unseenCount - updatedMessages.length }
                    : c
                )
              ),
              pageParams: prev.pageParams,
            }
          : {
              pages: [],
              pageParams: [],
            };
      };

      // update the chat's unseen count in specific provider panel
      queryClient.setQueryData<InfiniteData<Chat[]>>(
        MULTICHAT_QUERY_KEYS.chats(providerId),
        updater
      );

      // update the chat's unseen count in all chats panel
      queryClient.setQueryData<InfiniteData<Chat[]>>(
        MULTICHAT_QUERY_KEYS.chats(undefined),
        updater
      );
    },
  });
};
