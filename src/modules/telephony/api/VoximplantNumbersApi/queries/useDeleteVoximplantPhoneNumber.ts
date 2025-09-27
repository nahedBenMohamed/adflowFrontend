import { arraysShallowEqual } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantNumber } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantNumbersApi } from '../VoximplantNumbersApi';

export const useDeleteVoximplantPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (numberId: number) => voximplantNumbersApi.deleteVoximplantPhoneNumber(numberId),

    onSuccess: async (deletedNumberId: number): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        }),
      ]);

      queryClient.setQueryData<VoximplantNumber[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev => (prev ? prev.filter(n => n.id !== deletedNumberId) : prev)
      );

      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          arraysShallowEqual({
            arr1: queryKey.slice(0, 3),
            arr2: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers().slice(0, 3),
          }),
      });
    },
  });
};
