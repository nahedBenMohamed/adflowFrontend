import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GetShipmentsResult, Shipment } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { SHIPMENTS_LIMIT, shipmentApi } from '../ShipmentApi';

export interface UseChangeShipmentStatusArgs {
  shipmentId: number;
  statusId: number;
}

export const useChangeShipmentStatus = ({
  sectionId,
  page,
}: {
  sectionId: number;
  page: number;
}) => {
  const queryClient = useQueryClient();

  const offset = (page - 1) * SHIPMENTS_LIMIT;

  return useMutation({
    mutationFn: ({ shipmentId, statusId }: UseChangeShipmentStatusArgs) =>
      shipmentApi.changeShipmentStatus({ sectionId, shipmentId, statusId }),

    onSuccess: async updateShipment => {
      await queryClient.cancelQueries({
        queryKey: PRODUCTS_QUERY_KEYS.shipments({ sectionId, offset }),
      });

      queryClient.setQueryData<GetShipmentsResult>(
        PRODUCTS_QUERY_KEYS.shipments({ sectionId, offset }),
        prev => {
          if (!prev) {
            return {
              meta: {
                total: 0,
                offset: 0,
              },
              shipments: [],
            };
          }

          return {
            ...prev,
            shipments: prev.shipments.map<Shipment>(s =>
              s.id === updateShipment.id ? updateShipment : s
            ),
          };
        }
      );
    },
  });
};
