import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantApi } from '../VoximplantApi';

export const useGetVoximplantUsers = () =>
  useQuery({
    queryKey: TELEPHONY_QUERY_KEYS.users(),
    queryFn: voximplantApi.getVoximplantUsers,
  });
