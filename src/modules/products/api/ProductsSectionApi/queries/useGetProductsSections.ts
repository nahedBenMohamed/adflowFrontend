import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productsSectionApi } from '../ProductsSectionApi';

export const useGetProductsSections = () =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.sections(),
    // 45 seconds –> this hook is called in Sidebar, to prevent spamming the server
    // when frequently switching between sections, or opening tutorial drawer
    staleTime: 45 * 1000,
    queryFn: productsSectionApi.getProductsSections,
  });
