import { Optional } from '@/shared';
import { useQuery } from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';
import { subscriptionApi } from '../SubscriptionApi';

export const useGetSubscriptionForAccount = (accountId: Optional<number>) =>
  useQuery({
    queryKey: APP_QUERY_KEYS.subscriptionByAccountId(accountId ?? -1),
    queryFn: () => subscriptionApi.getSubscriptionForAccount(accountId ?? -1),
    enabled: Boolean(accountId),
  });
