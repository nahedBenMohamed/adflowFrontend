import { useQuery } from '@tanstack/react-query';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import { voximplantSIPApi } from '../VoximplantSIPApi';

export const useGetVoximplantSIPRegistrationsExpanded = ({
  refetchInterval,
  accessibleUserId,
}: {
  accessibleUserId?: number;
  refetchInterval?: number;
}) =>
  useQuery({
    refetchInterval,
    queryKey: TELEPHONY_QUERY_KEYS.voximplantSIPRegistrationsExpanded(accessibleUserId),
    queryFn: () => voximplantSIPApi.getVoximplantSIPRegistrationsExpanded({ accessibleUserId }),
  });
