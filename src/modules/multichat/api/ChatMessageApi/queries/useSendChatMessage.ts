import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChatLastMessageInCache } from '../../ChatApi';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { SendChatMessageDto } from '../../dtos';
import { chatMessageApi } from '../ChatMessageApi';
import { addChatMessageToCache } from '../helpers/addChatMessageToCache';

interface SendChatMessageMutationParams {
  chatId: number;
  dto: SendChatMessageDto;
}

export const useSendChatMessage = ({
  chatId,
  providerId,
}: {
  chatId: number;
  providerId?: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, dto }: SendChatMessageMutationParams) =>
      chatMessageApi.sendChatMessage({ chatId, dto }),

    onSuccess: async (createdMessage): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          predicate: query => query.queryKey.includes(MULTICHAT_QUERY_KEYS.multichat),
        }),
      ]);

      addChatMessageToCache({ chatId, message: createdMessage });

      updateChatLastMessageInCache({ providerId, chatId, message: createdMessage });
    },
  });
};
