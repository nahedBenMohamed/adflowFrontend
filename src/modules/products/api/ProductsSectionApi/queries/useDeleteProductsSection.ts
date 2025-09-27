import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productsSectionApi } from '../ProductsSectionApi';

export const useDeleteProductSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: number) => productsSectionApi.deleteProductsSection(sectionId),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEYS.sections() });

      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.sections() });
    },
  });
};
