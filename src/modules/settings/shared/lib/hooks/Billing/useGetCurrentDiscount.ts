import { subscriptionApi } from '@/app';
import { useQuery } from '@tanstack/react-query';
import { SETTINGS_QUERY_KEYS } from '../../../../api';

export const useGetCurrentDiscount = () =>
  useQuery({
    queryKey: SETTINGS_QUERY_KEYS.currentDiscount(),
    queryFn: subscriptionApi.getCurrentDiscount,
  });
