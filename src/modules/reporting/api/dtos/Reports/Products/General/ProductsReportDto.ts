import type { ProductsReportRowDto } from './ProductsReportRowDto';

export interface ProductsReportDto {
  products?: ProductsReportRowDto[];
  categories?: ProductsReportRowDto[];
  total?: ProductsReportRowDto;
}
