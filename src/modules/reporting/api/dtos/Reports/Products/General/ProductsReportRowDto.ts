import type { Nullable } from '@/shared';
import type { QuantityAmount } from '../../../../../shared';
import type { ProductsReportUserCellDto } from './ProductsReportUserCellDto';

export interface ProductsReportRowDto {
  ownerId: number;
  categoryId: Nullable<number>;
  productName: Nullable<string>;
  sold: QuantityAmount;
  shipped: Nullable<QuantityAmount>;
  open: Nullable<QuantityAmount>;
  lost: Nullable<QuantityAmount>;
  all: Nullable<QuantityAmount>;
  avgProducts: Nullable<number>;
  avgBudget: Nullable<number>;
  avgTerm: Nullable<number>;
  users: Nullable<ProductsReportUserCellDto[]>;
}
