import { SETTINGS_QUERY_KEYS, type UserToken } from '@/modules/settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userTokensApi } from '../UserTokensApi';

export const useCreateUserAccessToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userTokensApi.createUserAccessToken,
    onSuccess: async (createdToken): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.userAccessTokens(),
      });

      queryClient.setQueryData<UserToken[]>(SETTINGS_QUERY_KEYS.userAccessTokens(), prev =>
        prev ? [createdToken.userToken, ...prev] : [createdToken.userToken]
      );

      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.userAccessTokens() });
    },
  });
};
