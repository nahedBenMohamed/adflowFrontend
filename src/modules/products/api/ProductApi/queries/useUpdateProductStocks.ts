import { arraysShallowEqual } from '@/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetProductsResult, Product } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import type { UpdateStocksDto } from '../../dtos';
import { productApi } from '../ProductApi';

export const useUpdateProductStocks = ({
  sectionId,
  productId,
}: {
  sectionId: number;
  productId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateStocksDto) =>
      productApi.updateProductStocks({ sectionId, productId, dto }),
    onSuccess: async updatedStocks => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }),
        }),
        queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEYS.productsSection(sectionId) }),
      ]);

      queryClient.setQueriesData<Product>(
        { queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }) },
        prev => (prev ? { ...prev, stocks: updatedStocks } : prev)
      );

      queryClient.setQueriesData<GetProductsResult | Product>(
        {
          predicate: query =>
            arraysShallowEqual({
              arr1: query.queryKey.slice(0, PRODUCTS_QUERY_KEYS.productsSection(sectionId).length),
              arr2: PRODUCTS_QUERY_KEYS.productsSection(sectionId),
            }),
        },
        prev => {
          if (!prev) return;

          if (prev instanceof Product) {
            prev.stocks = updatedStocks;

            return prev;
          }

          if (prev instanceof GetProductsResult) {
            return {
              ...prev,
              products: prev.products.map<Product>(p => {
                if (p.id === productId) {
                  return { ...p, stocks: updatedStocks };
                }

                return p;
              }),
            };
          }
        }
      );
    },
  });
};
