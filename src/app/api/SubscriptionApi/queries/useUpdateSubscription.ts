import { Subscription } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';
import { UpdateSubscriptionDto } from '../../dtos';
import { subscriptionApi } from '../SubscriptionApi';

export const useUpdateSubscription = (accountId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: APP_QUERY_KEYS.subscriptionByAccountId(accountId),
    mutationFn: (dto: UpdateSubscriptionDto) =>
      subscriptionApi.updateSubscription({ accountId, dto: dto }),
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: APP_QUERY_KEYS.subscriptionByAccountId(accountId),
      });
    },
    onSuccess: async (subscription: Subscription): Promise<void> => {
      queryClient.setQueryData(APP_QUERY_KEYS.subscriptionByAccountId(accountId), subscription);
    },
  });
};
