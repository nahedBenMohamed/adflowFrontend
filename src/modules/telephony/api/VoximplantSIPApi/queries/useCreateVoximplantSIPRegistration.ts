import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantSIP } from '../../../shared';
import type { CreateVoximplantSIPDto } from '../../dtos';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { invalidateVoximplantSipRegistrationsCache } from '../helpers/invalidateVoximplantSIPRegistrationsCache';
import { voximplantSIPApi } from '../VoximplantSIPApi';

export const useCreateVoximplantSIPRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateVoximplantSIPDto) =>
      voximplantSIPApi.createVoximplantSIPRegistration(dto),
    onSuccess: async (createdRegistration): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrations(),
      });

      queryClient.setQueryData<VoximplantSIP[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev => (prev ? [createdRegistration, ...prev] : [createdRegistration])
      );

      invalidateVoximplantSipRegistrationsCache();
    },
  });
};
