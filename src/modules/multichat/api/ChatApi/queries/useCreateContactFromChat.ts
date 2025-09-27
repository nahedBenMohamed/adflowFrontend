import type { CreateContactAndLeadDto } from '@/app';
import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Chat } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';

export const useCreateContactFromChat = ({
  chatId,
  providerId,
}: {
  chatId: number;
  providerId?: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateContactAndLeadDto) => chatApi.createContactFromChat({ chatId, dto }),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: [...MULTICHAT_QUERY_KEYS.chat(chatId), MULTICHAT_QUERY_KEYS.chats(providerId)],
      });

      const refetchedChat = await queryClient.fetchQuery<Chat>({
        queryKey: MULTICHAT_QUERY_KEYS.chat(chatId),
      });

      queryClient.setQueryData<Chat>(MULTICHAT_QUERY_KEYS.chat(chatId), refetchedChat);
      queryClient.setQueryData<InfiniteData<Chat[]>>(
        MULTICHAT_QUERY_KEYS.chats(providerId),
        prev =>
          prev
            ? {
                pageParams: prev.pageParams,
                pages: prev.pages.map<Chat[]>(p =>
                  p.map<Chat>(c => (c.id === chatId ? refetchedChat : c))
                ),
              }
            : prev
      );
    },
  });
};
