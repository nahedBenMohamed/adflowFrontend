import { queryClient } from '@/index';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';

export const invalidateGetProductsQuery = (sectionId: number) =>
  queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.productsSection(sectionId) });
