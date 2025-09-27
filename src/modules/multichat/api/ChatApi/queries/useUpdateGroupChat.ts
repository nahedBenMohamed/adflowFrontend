import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { UpdateGroupChatDto } from '../../dtos';
import { chatApi } from '../ChatApi';
import { upsertChatInCache } from '../helpers/upsertChatInCache';

export const useUpdateGroupChat = (chatId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateGroupChatDto) => chatApi.updateGroupChat(chatId, dto),

    onSuccess: async updatedChat => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      queryClient.setQueryData(MULTICHAT_QUERY_KEYS.chat(updatedChat.id), updatedChat);

      upsertChatInCache(updatedChat);
    },
  });
};
