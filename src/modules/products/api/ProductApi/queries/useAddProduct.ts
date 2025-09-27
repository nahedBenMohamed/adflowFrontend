import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import type { CreateProductDto } from '../../dtos';
import { productApi } from '../ProductApi';

export const useAddProduct = (sectionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => productApi.addProduct({ sectionId, dto }),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEYS.productsSection(sectionId) });

      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.productsSection(sectionId) });
    },
  });
};
