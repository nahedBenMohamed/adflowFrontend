import { type AccountApiAccess, SETTINGS_QUERY_KEYS } from '@/modules/settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApiAccessApi } from '../AccountApiAccessApi';

export const useRecreateAccountApiAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApiAccessApi.recreateAccountApiAccess,
    onSuccess: async (recreatedApiAccess): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.accountApiAccess(),
      });

      queryClient.setQueryData<AccountApiAccess>(
        SETTINGS_QUERY_KEYS.accountApiAccess(),
        recreatedApiAccess
      );

      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.accountApiAccess() });
    },
  });
};
