import { queryClient } from '@/index';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';

export const invalidateEntityRentalProductOrdersInCache = ({
  sectionId,
  entityId,
}: {
  sectionId: number;
  entityId: number;
}) =>
  queryClient.invalidateQueries({
    queryKey: PRODUCTS_QUERY_KEYS.entityRentalProductOrders({ sectionId, entityId }),
  });
