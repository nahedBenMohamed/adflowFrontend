import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';
import { updateChatMessagesInCache } from '../helpers/updateChatMessagesInCache';

export const useReactToChatMessage = ({
  chatId,
  messageId,
}: {
  chatId: number;
  messageId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reaction: string) =>
      chatMessageApi.reactToChatMessage({ chatId, messageId, reaction }),

    onSuccess: async (updatedMessage): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      updateChatMessagesInCache({ chatId, messages: [updatedMessage] });
    },
  });
};
