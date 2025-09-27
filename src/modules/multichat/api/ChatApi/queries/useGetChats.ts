import { useInfiniteQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import { chatApi } from '../ChatApi';

export const useGetChats = ({ enabled, providerId }: { enabled?: boolean; providerId?: number }) =>
  useInfiniteQuery({
    enabled,
    initialPageParam: 0,
    queryKey: MULTICHAT_QUERY_KEYS.chats(providerId),
    queryFn: ({ pageParam = undefined }) => chatApi.getChats(providerId, pageParam),
    getNextPageParam: (lastPage, pages) => {
      // we use this condition to prevent error when we creating a new chat from entity
      // but chats were not loaded beforehand
      if (!lastPage) return;

      if (lastPage.length === 0 || !pages[0] || !pages[0][0]) return;

      return pages
        .flat()
        .reduce(
          (min, chat) => (min.updatedAt.greaterThan(chat.updatedAt) ? chat : min),
          pages[0][0]
        ).id;
    },
  });
