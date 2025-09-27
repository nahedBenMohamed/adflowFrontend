import type { Nullable, Optional } from '@/shared';
import type { ProductsReportRowDto } from '../../../../../../api';
import type { QuantityAmount } from '../../../QuantityAmount';
import { ProductsReportUserCell } from './ProductReportUserCell';

export class ProductsReportRow {
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
  users: Nullable<ProductsReportUserCell[]>;

  constructor({
    ownerId,
    categoryId,
    productName,
    sold,
    shipped,
    open,
    lost,
    all,
    avgProducts,
    avgBudget,
    avgTerm,
    users,
  }: {
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
    users: Nullable<ProductsReportUserCell[]>;
  }) {
    this.ownerId = ownerId;
    this.categoryId = categoryId;
    this.productName = productName;
    this.sold = sold;
    this.shipped = shipped;
    this.open = open;
    this.lost = lost;
    this.all = all;
    this.avgProducts = avgProducts;
    this.avgBudget = avgBudget;
    this.avgTerm = avgTerm;
    this.users = users;
  }

  static fromDto(dto: ProductsReportRowDto): ProductsReportRow {
    return new ProductsReportRow({
      ownerId: dto.ownerId,
      categoryId: dto.categoryId,
      productName: dto.productName,
      sold: dto.sold,
      shipped: dto.shipped,
      open: dto.open,
      lost: dto.lost,
      all: dto.all,
      avgProducts: dto.avgProducts,
      avgBudget: dto.avgBudget,
      avgTerm: dto.avgTerm,
      users: dto.users ? ProductsReportUserCell.fromDtos(dto.users) : null,
    });
  }

  static fromDtos(dtos: ProductsReportRowDto[]): ProductsReportRow[] {
    return dtos.map(this.fromDto);
  }

  findUserCellById = (userId: number): Optional<ProductsReportUserCell> => {
    return this.users?.find(u => u.userId === userId);
  };
}
