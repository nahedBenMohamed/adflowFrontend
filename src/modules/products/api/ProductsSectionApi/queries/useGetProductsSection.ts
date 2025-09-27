import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productsSectionApi } from '../ProductsSectionApi';

export const useGetProductsSection = (sectionId: number) =>
  useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.section(sectionId),
    queryFn: () => productsSectionApi.getProductsSection(sectionId),
  });
