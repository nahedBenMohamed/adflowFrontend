import { queryClient } from '@/index';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';

export const invalidateUserProfilesInCache = () =>
  queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.userProfiles });
