import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantUser } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantApi } from '../VoximplantApi';

export const useDeleteVoximplantUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => voximplantApi.deleteVoximplantUser(userId),
    onSuccess: async (): Promise<void> => {
      await Promise.all([queryClient.cancelQueries({ queryKey: TELEPHONY_QUERY_KEYS.users() })]);

      queryClient.setQueryData<VoximplantUser[]>(TELEPHONY_QUERY_KEYS.users(), prev =>
        prev ? prev.filter(u => u.userId !== userId) : []
      );
    },
  });
};
