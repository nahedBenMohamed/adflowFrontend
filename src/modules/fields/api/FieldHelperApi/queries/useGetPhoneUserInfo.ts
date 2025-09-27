import { useQuery } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { FIELDS_QUERY_KEYS } from '../../FieldsQueryKeys';
import { fieldHelperApi } from '../FieldHelperApi';

const limit = pLimit(5);

export const useGetPhoneUserInfo = ({ phone, enabled }: { phone: string; enabled?: boolean }) =>
  useQuery({
    enabled,
    queryKey: FIELDS_QUERY_KEYS.phoneUserInfo(phone),
    // 30 minutes
    staleTime: 30 * 60 * 1000,
    queryFn: () => limit(() => fieldHelperApi.getPhoneUserInfo(phone)),
  });
