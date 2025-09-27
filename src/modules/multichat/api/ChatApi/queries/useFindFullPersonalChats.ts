import { PagingMeta } from '@/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';
import type { ChatFindPersonalFilterDto } from '../../dtos';
import { chatApi } from '../ChatApi';

export const useFindFullPersonalChats = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter?: ChatFindPersonalFilterDto;
}) =>
  useInfiniteQuery({
    enabled,
    queryKey: MULTICHAT_QUERY_KEYS.findFullChats(filter),
    initialPageParam: new PagingMeta(0, 0),
    queryFn: ({ pageParam }) => chatApi.findFullChatsPersonal({ filter, offset: pageParam.offset }),

    getNextPageParam: lastPage => {
      if (!lastPage) return;

      const { offset, total } = lastPage.meta;

      return total === offset || !lastPage.chats.length ? undefined : lastPage.meta;
    },
  });
