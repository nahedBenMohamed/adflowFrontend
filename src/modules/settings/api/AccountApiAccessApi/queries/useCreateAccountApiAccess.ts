import { type AccountApiAccess, SETTINGS_QUERY_KEYS } from '@/modules/settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApiAccessApi } from '../AccountApiAccessApi';

export const useCreateAccountApiAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApiAccessApi.createAccountApiAccess,
    onSuccess: async (createdApiAccess): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.accountApiAccess(),
      });

      queryClient.setQueryData<AccountApiAccess>(
        SETTINGS_QUERY_KEYS.accountApiAccess(),
        createdApiAccess
      );

      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.accountApiAccess() });
    },
  });
};
