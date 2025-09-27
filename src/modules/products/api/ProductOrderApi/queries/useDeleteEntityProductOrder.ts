import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productOrderApi } from '../ProductOrderApi';

export const useDeleteEntityProductOrder = ({
  entityId,
  sectionId,
  orderId,
}: {
  entityId: number;
  sectionId: number;
  orderId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ returnStocks }: { returnStocks?: boolean }) =>
      productOrderApi.deleteEntityProductOrder({ sectionId, orderId, returnStocks }),
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: PRODUCTS_QUERY_KEYS.entityProductOrders(entityId),
        }),
      ]);

      queryClient.setQueryData<Order[]>(PRODUCTS_QUERY_KEYS.entityProductOrders(entityId), prev =>
        prev ? prev.filter(o => o.id !== orderId) : prev
      );
    },
  });
};
