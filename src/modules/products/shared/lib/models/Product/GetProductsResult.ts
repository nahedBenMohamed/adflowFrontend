import type { GetProductsResultDto } from '../../../../api';
import type { GetProductsMeta } from './GetProductsMeta';
import { Product } from './Product';

export class GetProductsResult {
  meta: GetProductsMeta;
  products: Product[];

  constructor({ meta, products }: GetProductsResult) {
    this.meta = meta;
    this.products = products;
  }

  static fromDto(dto: GetProductsResultDto): GetProductsResult {
    return new GetProductsResult({ meta: dto.meta, products: Product.fromDtos(dto.products) });
  }
}
