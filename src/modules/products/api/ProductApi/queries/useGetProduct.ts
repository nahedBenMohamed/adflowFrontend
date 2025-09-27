import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { Product } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productApi } from '../ProductApi';

export const useGetProduct = ({
  sectionId,
  productId,
  options,
}: {
  sectionId: number;
  productId: number;
  options?: UseQueryOptions<Product>;
}) =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }),
    queryFn: () => productApi.getProduct({ sectionId, productId }),
    ...options,
  });
