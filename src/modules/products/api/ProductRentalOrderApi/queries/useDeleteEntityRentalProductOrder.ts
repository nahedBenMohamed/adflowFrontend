import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RentalOrder } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productRentalOrderApi } from '../ProductRentalOrderApi';

export const useDeleteEntityRentalProductOrder = ({
  orderId,
  sectionId,
  entityId,
}: {
  orderId: number;
  sectionId: number;
  entityId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productRentalOrderApi.deleteEntityRentalProductOrder({ sectionId, orderId }),
    onSuccess: async (): Promise<void> => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: PRODUCTS_QUERY_KEYS.entityRentalProductOrders({ sectionId, entityId }),
        }),
      ]);

      queryClient.setQueryData<RentalOrder[]>(
        PRODUCTS_QUERY_KEYS.entityRentalProductOrders({ sectionId, entityId }),
        prev => (prev ? prev.filter(o => o.id !== orderId) : prev)
      );
    },
  });
};
