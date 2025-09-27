import { queryClient } from '@/index';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';

export const invalidateGoogleCalendarIntegrationsInCache = () =>
  queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.googleCalendarIntegrations() });
