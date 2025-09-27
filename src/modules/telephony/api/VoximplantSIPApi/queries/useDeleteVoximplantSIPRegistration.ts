import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantSIP } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantSIPApi } from '../VoximplantSIPApi';
import { invalidateVoximplantSipRegistrationsCache } from '../helpers/invalidateVoximplantSIPRegistrationsCache';

export const useDeleteVoximplantSIPRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sipId: number) => voximplantSIPApi.deleteVoximplantSIPRegistration(sipId),
    onSuccess: async (deletedSipId): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrations(),
      });

      queryClient.setQueryData<VoximplantSIP[]>(
        TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
        prev => (prev ? prev.filter(p => p.id !== deletedSipId) : prev)
      );

      invalidateVoximplantSipRegistrationsCache();
    },
  });
};
