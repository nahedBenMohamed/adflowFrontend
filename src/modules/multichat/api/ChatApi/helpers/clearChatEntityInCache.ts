import { queryClient } from '@/index';
import { arraysShallowEqual } from '@/shared';
import type { InfiniteData } from '@tanstack/react-query';
import type { Chat } from '../../../shared';
import { MULTICHAT_QUERY_KEYS } from '../../MultichatQueryKeys';

export const clearChatEntityInCache = (entityId: number): void => {
  queryClient.setQueriesData<Chat>(
    {
      predicate: query =>
        arraysShallowEqual({
          arr1: query.queryKey.slice(0, 2),
          arr2: MULTICHAT_QUERY_KEYS.chat(-1).slice(0, 2),
        }),
    },
    prev =>
      prev
        ? prev.entityId === entityId
          ? {
              ...prev,
              entityId: null,
              entityInfo: null,
            }
          : prev
        : prev
  );

  queryClient.setQueriesData<InfiniteData<Chat[]>>(
    {
      predicate: query =>
        arraysShallowEqual({
          arr1: query.queryKey.slice(0, 2),
          arr2: MULTICHAT_QUERY_KEYS.chats().slice(0, 2),
        }),
    },
    prev =>
      prev
        ? {
            pageParams: prev.pageParams,
            pages: prev.pages.map(p =>
              p.map(c =>
                c.entityId === entityId
                  ? {
                      ...c,
                      entityId: null,
                      entityInfo: null,
                    }
                  : c
              )
            ),
          }
        : prev
  );
};
