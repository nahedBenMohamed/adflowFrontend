import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productApi } from '../ProductApi';

export const useDeleteProduct = ({
  sectionId,
  productId,
}: {
  sectionId: number;
  productId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productApi.deleteProduct({ sectionId, productId }),

    // temporary solution!
    // TODO: Proper cache invalidation in all queries which contain deleted product
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.productsSection(sectionId) }),
  });
};
