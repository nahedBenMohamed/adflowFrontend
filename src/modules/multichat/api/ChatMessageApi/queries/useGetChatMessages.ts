import { PagingMeta } from '@/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatMessageApi } from '../ChatMessageApi';

export const useGetChatMessages = (chatId: number) =>
  useInfiniteQuery({
    queryKey: MULTICHAT_QUERY_KEYS.messages(chatId),
    initialPageParam: new PagingMeta(0, 0),
    queryFn: ({ pageParam }) => chatMessageApi.getChatMessages(chatId, pageParam.offset),
    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset ? undefined : lastPage.meta;
    },
  });
