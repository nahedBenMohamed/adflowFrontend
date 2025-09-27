import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantNumbersApi } from '../VoximplantNumbersApi';

export const useGetVoximplantPhoneNumbers = ({ accessibleUserId }: { accessibleUserId?: number }) =>
  useQuery({
    staleTime: 60 * 1000,
    queryKey: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(accessibleUserId),
    queryFn: () => voximplantNumbersApi.getVoximplantPhoneNumbers(accessibleUserId),
  });
