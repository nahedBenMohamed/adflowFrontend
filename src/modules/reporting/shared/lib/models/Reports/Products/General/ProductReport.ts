import type { Nullable, Optional } from '@/shared';
import type { ProductsReportDto } from '../../../../../../api';
import { ProductsReportRow } from './ProductReportRow';

export class ProductsReport {
  products?: Nullable<ProductsReportRow[]>;
  categories?: Nullable<ProductsReportRow[]>;
  total?: Nullable<ProductsReportRow>;

  constructor({
    products,
    categories,
    total,
  }: {
    products: Nullable<ProductsReportRow[]>;
    categories: Nullable<ProductsReportRow[]>;
    total: Nullable<ProductsReportRow>;
  }) {
    this.products = products;
    this.categories = categories;
    this.total = total;
  }

  static fromDto(dto: ProductsReportDto): ProductsReport {
    return new ProductsReport({
      products: dto.products ? ProductsReportRow.fromDtos(dto.products) : null,
      categories: dto.categories ? ProductsReportRow.fromDtos(dto.categories) : null,
      total: dto.total ? ProductsReportRow.fromDto(dto.total) : null,
    });
  }

  get productsWithoutCategory(): ProductsReportRow[] {
    return this.products?.filter(p => !p.categoryId) ?? [];
  }

  findCategoryRowById = (id: number): Optional<ProductsReportRow> => {
    return this.categories?.find(c => c.ownerId === id);
  };

  findProductRowById = (id: number): Optional<ProductsReportRow> => {
    return this.products?.find(p => p.ownerId === id);
  };

  getProductsByCategoryId = (categoryId: number): ProductsReportRow[] => {
    return this.products?.filter(p => p.categoryId === categoryId) ?? [];
  };
}
