import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { userTokensApi } from '../UserTokensApi';

export const useGetUserAccessTokens = () =>
  useQuery({
    queryKey: SETTINGS_QUERY_KEYS.userAccessTokens(),
    queryFn: userTokensApi.getUserAccessTokens,
  });
