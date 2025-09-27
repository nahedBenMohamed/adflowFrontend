import { productApi } from '../../../api';

export const checkDuplicateProductSku = async ({
  sku,
  sectionId,
  currentProductId,
}: {
  sku: string;
  sectionId: number;
  currentProductId?: number;
}): Promise<boolean> => {
  const { products } = await productApi.getProducts({ sectionId, queryParams: { sku } });

  const firstProduct = products[0];

  if (
    firstProduct &&
    currentProductId &&
    products.length === 1 &&
    firstProduct.id === currentProductId
  )
    return false;

  return products.length > 0;
};
