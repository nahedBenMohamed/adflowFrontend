import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { googleCalendarIntegrationApi } from '../GoogleCalendarIntegrationApi';

export const useGetGoogleCalendarIntegrations = () =>
  useQuery({
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryKey: SETTINGS_QUERY_KEYS.googleCalendarIntegrations(),
    queryFn: googleCalendarIntegrationApi.getGoogleCalendarIntegrations,
  });
