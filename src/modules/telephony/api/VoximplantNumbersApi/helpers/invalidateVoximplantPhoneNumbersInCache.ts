import { queryClient } from '@/index';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';

export const invalidateVoximplantPhoneNumbersInCache = () =>
  queryClient.invalidateQueries({
    queryKey: TELEPHONY_QUERY_KEYS.voximplantPhoneNumbers(),
  });
