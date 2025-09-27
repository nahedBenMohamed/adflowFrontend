import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';
import { productApi } from '../ProductApi';

export const useUploadProductImages = ({
  sectionId,
  productId,
}: {
  sectionId: number;
  productId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: FileList) =>
      productApi.uploadProductImages({ sectionId, productId, images }),
    onSuccess: async fileLinks => {
      await queryClient.cancelQueries({
        queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }),
      });

      queryClient.setQueriesData<Product>(
        { queryKey: PRODUCTS_QUERY_KEYS.product({ sectionId, productId }) },
        prev => (prev ? { ...prev, photoFileLinks: [...prev.photoFileLinks, ...fileLinks] } : prev)
      );
    },
  });
};
