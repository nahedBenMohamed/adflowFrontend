import { queryClient } from '@/index';
import type { Product } from '../../../shared';
import { PRODUCTS_QUERY_KEYS } from '../../ProductsQueryKeys';

export const removeImagesFromProductCache = ({
  sectionId,
  productId,
  fileLinkIds,
}: {
  sectionId: number;
  productId: number;
  fileLinkIds: number[];
}) =>
  queryClient.setQueryData<Product>(PRODUCTS_QUERY_KEYS.product({ sectionId, productId }), prev => {
    return prev
      ? {
          ...prev,
          photoFileLinks: prev.photoFileLinks.filter(f => !fileLinkIds.includes(f.id)),
        }
      : prev;
  });
