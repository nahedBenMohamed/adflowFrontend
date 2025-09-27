import { arraysShallowEqual } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantNumber } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import type { UpdateVoximplantNumberDto } from '../../dtos';
import { voximplantNumbersApi } from '../VoximplantNumbersApi';

export const useUpdateVoximplantPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ numberId, dto }: { numberId: number; dto: UpdateVoximplantNumberDto }) =>
      voximplantNumbersApi.updateVoximplantPhoneNumber({ numberId, dto }),

    onSuccess: async (updatedNumber): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        }),
      ]);

      queryClient.setQueryData<VoximplantNumber[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev =>
          prev
            ? prev.map<VoximplantNumber>(n =>
                n.externalId === updatedNumber.externalId ? updatedNumber : n
              )
            : [updatedNumber]
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
