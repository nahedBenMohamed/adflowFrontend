import { queryClient } from '@/index';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import type { GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const invalidateGetExpandedTutorialGroupsQuery = async (
  queryParams: GetExpandedTutorialGroupsQueryParams
): Promise<void> => {
  await queryClient.cancelQueries({ queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams) });

  queryClient.invalidateQueries({
    queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
  });
};
