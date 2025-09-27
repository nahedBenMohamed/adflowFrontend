import { queryClient } from '@/index';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';

export const invalidateEntityProductOrdersInCache = (entityId: number) =>
  queryClient.invalidateQueries({
    queryKey: PRODUCTS_QUERY_KEYS.entityProductOrders(entityId),
  });
