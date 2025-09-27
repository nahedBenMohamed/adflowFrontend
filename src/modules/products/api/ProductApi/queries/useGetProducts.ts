import { keepPreviousData, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { GetProductsResult } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { PRODUCTS_LIMIT, productApi, type GetProductsQueryParams } from '../ProductApi';

export const useGetProducts = ({
  sectionId,
  page,
  queryParams,
  options,
}: {
  sectionId: number;
  page: number;
  queryParams: GetProductsQueryParams;
  options?: UseQueryOptions<GetProductsResult>;
}) => {
  const offset = (page - 1) * PRODUCTS_LIMIT;

  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEYS.productsSection(sectionId), queryParams, offset],
    queryFn: () =>
      productApi.getProducts({
        sectionId,
        queryParams: {
          offset,
          ...queryParams,
        },
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
};
