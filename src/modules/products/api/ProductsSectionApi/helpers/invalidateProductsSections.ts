import { queryClient } from '@/index';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';

export const invalidateProductsSections = () =>
  queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.sections() });
