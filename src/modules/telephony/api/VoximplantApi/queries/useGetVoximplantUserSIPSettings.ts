import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantApi } from '../VoximplantApi';

export const useGetVoximplantUserSIPSettings = (userId: number) =>
  useQuery({
    queryKey: TELEPHONY_QUERY_KEYS.userSIPSettings(userId),
    queryFn: () => voximplantApi.getVoximplantUserSIPSettings(userId),
  });
