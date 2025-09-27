import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TutorialGroup } from '../../../shared';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import type { CreateTutorialGroupDto } from '../../dtos';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useCreateTutorialGroup = (queryParams: GetExpandedTutorialGroupsQueryParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTutorialGroupDto) => tutorialApi.createTutorialGroup(dto),
    onSuccess: async (createdGroup): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
      });

      queryClient.setQueryData<TutorialGroup[]>(TUTORIAL_QUERY_KEYS.groups(queryParams), prev =>
        prev ? [createdGroup, ...prev] : []
      );
    },
  });
};
