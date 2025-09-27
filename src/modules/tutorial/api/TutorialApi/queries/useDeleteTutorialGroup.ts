import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useDeleteTutorialGroup = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => tutorialApi.deleteTutorialGroup(groupId),
    onSuccess: async (deletedGroupId): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev ? prev.filter(g => g.id !== deletedGroupId) : []
      );
    },
  });
};
