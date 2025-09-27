import type { GetProductsMeta } from '../../../shared';
import type { ProductDto } from './ProductDto';

export class GetProductsResultDto {
  meta: GetProductsMeta;
  products: ProductDto[];

  constructor({ meta, products }: GetProductsResultDto) {
    this.meta = meta;
    this.products = products;
  }
}
