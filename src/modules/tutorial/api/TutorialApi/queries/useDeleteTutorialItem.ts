import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useDeleteTutorialItem = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, groupId }: { itemId: number; groupId: number }) =>
      tutorialApi.deleteTutorialGroupItem({ itemId, groupId }),
    onSuccess: async ({ deletedFromGroupId, deletedItemId }): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev
          ? prev.map(g =>
              g.id === deletedFromGroupId
                ? { ...g, items: g.items.filter(i => i.id !== deletedItemId) }
                : g
            )
          : []
      );
    },
  });
};
