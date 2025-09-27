import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMultichatContext } from '../../../context';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { CreateGroupChatDto } from '../../dtos';
import { chatApi } from '../ChatApi';
import { upsertChatInCache } from '../helpers/upsertChatInCache';

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();
  const { setActiveChatId } = useMultichatContext();

  return useMutation({
    mutationFn: (dto: CreateGroupChatDto) => chatApi.createGroupChat(dto),

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
