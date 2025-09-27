import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productOrderApi } from '../ProductOrderApi';

export const useGetEntityProductOrders = (entityId: number) =>
  useQuery({
    refetchOnWindowFocus: false,
    queryKey: PRODUCTS_QUERY_KEYS.entityProductOrders(entityId),
    queryFn: () => productOrderApi.getEntityProductOrders(entityId),
  });
