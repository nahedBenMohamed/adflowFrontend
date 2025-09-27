import type { Nullable } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { UpdateChatMessageDto } from '../../dtos';
import { chatMessageApi } from '../ChatMessageApi';
import { updateChatMessagesInCache } from '../helpers/updateChatMessagesInCache';

interface UpdateChatMessageMutationParams {
  chatId: number;
  dto: UpdateChatMessageDto;
}

export const useUpdateChatMessage = ({
  chatId,
  messageId,
}: {
  chatId: number;
  messageId: Nullable<number>;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, dto }: UpdateChatMessageMutationParams) => {
      if (messageId === null) return Promise.reject();

      return chatMessageApi.updateChatMessage({ chatId, messageId, dto });
    },

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
