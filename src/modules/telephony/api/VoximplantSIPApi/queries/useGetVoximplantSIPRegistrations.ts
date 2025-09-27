import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantSIPApi } from '../VoximplantSIPApi';

export const useGetVoximplantSIPRegistrations = ({
  refetchInterval,
  accessibleUserId,
}: {
  accessibleUserId?: number;
  refetchInterval?: number;
}) =>
  useQuery({
    refetchInterval,
    queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrations(accessibleUserId),
    queryFn: () => voximplantSIPApi.getVoximplantSIPRegistrations({ accessibleUserId }),
  });
