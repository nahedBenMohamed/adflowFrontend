import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';
import { deleteChatMessageInCache } from '../helpers/deleteChatMessageInCache';

export const useDeleteChatMessage = ({
  chatId,
  messageId,
}: {
  chatId: number;
  messageId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatMessageApi.deleteChatMessage({ chatId, messageId }),

    onMutate: async (): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      deleteChatMessageInCache({ chatId, messageId });
    },
  });
};
