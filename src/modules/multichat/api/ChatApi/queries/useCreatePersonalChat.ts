import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMultichatContext } from '../../../context';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { CreatePersonalChatDto } from '../../dtos';
import { chatApi } from '../ChatApi';
import { upsertChatInCache } from '../helpers/upsertChatInCache';

export const useCreatePersonalChat = () => {
  const queryClient = useQueryClient();
  const { setActiveChatId } = useMultichatContext();

  return useMutation({
    mutationFn: (dto: CreatePersonalChatDto) => chatApi.createPersonalChat(dto),

    onSuccess: async createdChat => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      upsertChatInCache(createdChat);

      setActiveChatId(createdChat.id);
    },
  });
};
