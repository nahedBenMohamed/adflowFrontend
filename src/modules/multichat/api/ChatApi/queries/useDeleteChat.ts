import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';
import { deleteChatInCache } from '../helpers/deleteChatInCache';

export const useDeleteChat = ({ providerId, chatId }: { providerId: number; chatId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatApi.deleteChat(chatId),

    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({
        predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
      });

      deleteChatInCache({ providerId, chatId });
    },
  });
};
