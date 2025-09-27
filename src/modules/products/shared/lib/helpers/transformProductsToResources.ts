import type { ProductInfoDto } from '../../../api';

interface ProductResource {
  id: string;
  title: string;
}

export const transformProductsToResources = (products: ProductInfoDto[] = []): ProductResource[] =>
  products.map<ProductResource>(p => ({
    id: String(p.id),
    title: p.name,
  }));
