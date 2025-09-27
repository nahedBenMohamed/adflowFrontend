import type { Nullable } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantSIPApi } from '../VoximplantSIPApi';

export const useGetVoximplantSIPRegistrationByExternalId = (externalId: Nullable<number>) =>
  useQuery({
    queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrationByExternalId(externalId),
    queryFn: () => voximplantSIPApi.getVoximplantSIPRegistrationByExternalId(externalId),
  });
