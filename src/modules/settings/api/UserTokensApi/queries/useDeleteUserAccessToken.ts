import { SETTINGS_QUERY_KEYS, type UserToken } from '@/modules/settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userTokensApi } from '../UserTokensApi';

export const useDeleteUserAccessToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userTokensApi.deleteUserAccessToken,
    onSuccess: async (deletedTokenId): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.userAccessTokens(),
      });

      queryClient.setQueryData<UserToken[]>(SETTINGS_QUERY_KEYS.userAccessTokens(), prev =>
        prev?.filter(tk => tk.id !== deletedTokenId)
      );

      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.userAccessTokens() });
    },
  });
};
