import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { accountApiAccessApi } from '../AccountApiAccessApi';

export const useGetAccountApiAccess = () =>
  useQuery({
    queryKey: SETTINGS_QUERY_KEYS.accountApiAccess(),
    queryFn: accountApiAccessApi.getAccountApiAccess,
  });
