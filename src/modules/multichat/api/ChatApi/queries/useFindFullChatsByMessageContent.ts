import { PagingMeta } from '@/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { ChatFindByMessageContentFilterDto } from '../../dtos';
import { chatApi } from '../ChatApi';

export const useFindFullChatsByMessageContent = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter?: ChatFindByMessageContentFilterDto;
}) =>
  useInfiniteQuery({
    enabled,
    queryKey: MULTICHAT_QUERY_KEYS.findFullChats(filter),
    initialPageParam: new PagingMeta(0, 0),
    queryFn: ({ pageParam }) =>
      chatApi.findFullChatsByMessageContent({ filter, offset: pageParam.offset }),

    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset || !lastPage.chats.length ? undefined : lastPage.meta;
    },
  });
