import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantNumbersApi } from '../VoximplantNumbersApi';

export const useGetVoximplantAvailablePhoneNumbers = () =>
  useQuery({
    queryKey: TELEPHONY_QUERY_KEYS.voximplantAvailablePhoneNumbers(),
    queryFn: voximplantNumbersApi.getVoximplantAvailablePhoneNumbers,
  });
