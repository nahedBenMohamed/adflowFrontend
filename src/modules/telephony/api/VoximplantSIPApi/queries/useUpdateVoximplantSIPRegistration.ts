import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantSIP } from '../../../shared';
import type { UpdateVoximplantSIPDto } from '../../dtos';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { invalidateVoximplantSipRegistrationsCache } from '../helpers/invalidateVoximplantSIPRegistrationsCache';
import { voximplantSIPApi } from '../VoximplantSIPApi';

export const useUpdateVoximplantSIPRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sipId, dto }: { sipId: number; dto: UpdateVoximplantSIPDto }) =>
      voximplantSIPApi.updateVoximplantSIPRegistration({ sipId, dto }),
    onSuccess: async (updatedRegistration): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrations(),
      });

      queryClient.setQueryData<VoximplantSIP[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev =>
          prev
            ? prev.map<VoximplantSIP>(p =>
                p.id === updatedRegistration.id ? updatedRegistration : p
              )
            : prev
      );

      invalidateVoximplantSipRegistrationsCache();
    },
  });
};
