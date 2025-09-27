import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import type { UpdateProductDto } from '../../dtos';
import { productApi } from '../ProductApi';

export const useUpdateProduct = ({
  sectionId,
  productId,
}: {
  sectionId: number;
  productId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProductDto) => productApi.updateProduct({ sectionId, productId, dto }),
    onSuccess: async updatedProduct => {
      await queryClient.cancelQueries({
        queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }),
      });

      queryClient.setQueryData(
        PRODUCTS_QUERY_KEYS.product({ sectionId, productId }),
        updatedProduct
      );
    },
  });
};
