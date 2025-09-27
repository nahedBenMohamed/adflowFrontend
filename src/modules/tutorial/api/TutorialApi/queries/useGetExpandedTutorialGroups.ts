import { useQuery } from '@tanstack/react-query';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import { tutorialApi, type GetExpandedTutorialGroupsQueryParams } from '../TutorialApi';

export const useGetExpandedTutorialGroups = ({
  queryParams,
  enabled,
}: {
  queryParams: GetExpandedTutorialGroupsQueryParams;
  enabled: boolean;
}) =>
  useQuery({
    enabled,
    queryKey: TUTORIAL_QUERY_KEYS.groups(queryParams),
    queryFn: () => tutorialApi.getExpandedTutorialGroups(queryParams),
  });
