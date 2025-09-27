import { useQuery } from '@tanstack/react-query';
import { TUTORIAL_QUERY_KEYS } from '../../TutorialQueryKeys';
import { tutorialApi, type GetTutorialCountQueryParams } from '../TutorialApi';

export const useGetTutorialCount = (queryParams: GetTutorialCountQueryParams) =>
  useQuery({
    queryKey: TUTORIAL_QUERY_KEYS.count(queryParams),
    queryFn: () => tutorialApi.getTutorialCount(queryParams),
  });
