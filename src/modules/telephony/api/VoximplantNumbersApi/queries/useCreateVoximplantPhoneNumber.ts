import { arraysShallowEqual } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantNumber } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import type { CreateVoximplantNumberDto } from '../../dtos';
import { voximplantNumbersApi } from '../VoximplantNumbersApi';

export const useCreateVoximplantPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateVoximplantNumberDto) =>
      voximplantNumbersApi.createVoximplantPhoneNumber(dto),

    onSuccess: async (createdNumber): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        }),
      ]);

      queryClient.setQueryData<VoximplantNumber[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev => (prev ? [createdNumber, ...prev] : [createdNumber])
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
