import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../SettingsQueryKeys';
import { billingLifetimePromoApi } from '../BillingLifetimePromoApi';

export const useGetBillingLifetimePromoPrices = () =>
  useQuery({
    queryKey: SETTINGS_QUERY_KEYS.myworkBillingPromoPrices(),
    queryFn: billingLifetimePromoApi.getActualLifetimeDealPrices,
  });
