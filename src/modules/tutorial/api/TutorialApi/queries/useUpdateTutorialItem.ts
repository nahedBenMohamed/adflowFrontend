import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup, TutorialItem } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import type { UpdateTutorialItemDto } from '../../dtos';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useUpdateTutorialItem = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  const { userId, productType, objectId = null } = queryParams;

  return useMutation({
    mutationFn: ({
      groupId,
      itemId,
      dto,
    }: {
      groupId: number;
      itemId: number;
      dto: UpdateTutorialItemDto;
    }) =>
      tutorialApi.updateTutorialGroupItem({
        dto,
        itemId,
        groupId,
      }),
    onSuccess: async (updatedItem): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev
          ? prev.map(g => {
              if (g.id === updatedItem.groupId) {
                let items: TutorialItem[] = [];

                if (
                  userId &&
                  productType &&
                  updatedItem.userIds?.includes(userId) &&
                  updatedItem.products?.some(p => p.type === productType && p.objectId === objectId)
                ) {
                  // add or update item if it satisfies the constraints (hence visible to the user)
                  const itemIdx = g.items.findIndex(i => i.id === updatedItem.id);

                  if (itemIdx === -1) {
                    items = [...g.items, updatedItem].sort((a, b) => a.sortOrder - b.sortOrder);
                  } else {
                    items = g.items.map(i => (i.id === updatedItem.id ? updatedItem : i));
                  }
                } else {
                  // otherwise, remove the item because it's no longer visible to the user
                  items = g.items.filter(i => i.id !== updatedItem.id);
                }

                return {
                  ...g,
                  items,
                };
              }

              return g;
            })
          : []
      );
    },
  });
};
