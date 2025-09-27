import { queryClient } from '@/index';
import { arraysShallowEqual } from '@/shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';

export const invalidateVoximplantSipRegistrationsCache = () =>
  queryClient.invalidateQueries({
    predicate: query =>
      arraysShallowEqual({
        arr1: query.queryKey.slice(0, 3),
        arr2: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrations().slice(0, 3),
      }),
  });
