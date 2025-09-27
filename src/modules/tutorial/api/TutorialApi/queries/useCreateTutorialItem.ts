import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import type { CreateTutorialItemDto } from '../../dtos';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useCreateTutorialItem = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, dto }: { groupId: number; dto: CreateTutorialItemDto }) =>
      tutorialApi.createTutorialGroupItem({ groupId, dto }),
    onSuccess: async (createdItem): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev
          ? prev.map(g =>
              g.id === createdItem.groupId ? { ...g, items: [...g.items, createdItem] } : g
            )
          : []
      );
    },
  });
};
