import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import { UpdateTutorialGroupDto } from '../../dtos';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useUpdateTutorialGroupName = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, name }: { groupId: number; name: string }) =>
      tutorialApi.updateTutorialGroup({
        groupId,
        dto: UpdateTutorialGroupDto.create({
          name,
        }),
      }),
    onSuccess: async (updatedGroup): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev
          ? prev.map(g =>
              g.id === updatedGroup.id
                ? {
                    ...g,
                    name: updatedGroup.name,
                  }
                : g
            )
          : []
      );
    },
  });
};
