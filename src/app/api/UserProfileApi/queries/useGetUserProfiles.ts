import { useQueries } from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';
import { userProfileApi } from '../UserProfileApi';

export const useGetUserProfiles = ({ userIds }: { userIds: number[] }) => {
  return useQueries({
    queries: userIds.map(userId => ({
      queryKey: APP_QUERY_KEYS.userProfile(userId),
      queryFn: () => userProfileApi.getUserProfile(userId),
    })),
    combine: res => ({
      data: res.map((result, idx) => ({
        userId: userIds[idx]!,
        settings: result.data,
      })),
      isLoading: res.some(result => result.isPending),
    }),
  });
};
