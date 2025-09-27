import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RentalOrder, RentalOrderStatus } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productRentalOrderApi } from '../ProductRentalOrderApi';

export const useChangeRentalOrderStatus = ({
  sectionId,
  orderId,
}: {
  sectionId: number;
  orderId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: RentalOrderStatus) =>
      productRentalOrderApi.changeRentalOrderStatus({ sectionId, orderId, status }),
    onSuccess: async (updatedOrder): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: PRODUCTS_QUERY_KEYS.entityRentalProductOrders({
          sectionId,
          entityId: updatedOrder.entityInfo.id,
        }),
      });

      queryClient.setQueryData<RentalOrder[]>(
        PRODUCTS_QUERY_KEYS.entityRentalProductOrders({
          sectionId,
          entityId: updatedOrder.entityInfo.id,
        }),
        prev =>
          prev ? prev.map<RentalOrder>(o => (o.id === updatedOrder.id ? updatedOrder : o)) : []
      );
    },
  });
};
