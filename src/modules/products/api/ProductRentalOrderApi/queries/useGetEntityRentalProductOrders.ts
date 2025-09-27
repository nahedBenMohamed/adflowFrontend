import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productRentalOrderApi } from '../ProductRentalOrderApi';

export const useGetEntityRentalProductOrders = ({
  sectionId,
  entityId,
}: {
  sectionId: number;
  entityId: number;
}) => {
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: PRODUCTS_QUERY_KEYS.entityRentalProductOrders({ sectionId, entityId }),
    queryFn: () => productRentalOrderApi.getEntityRentalProductOrders({ sectionId, entityId }),
  });
};
