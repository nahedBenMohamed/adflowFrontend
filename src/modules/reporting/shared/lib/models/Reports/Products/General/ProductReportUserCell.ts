import type { ProductsReportUserCellDto } from '../../../../../../api';
import type { QuantityAmount } from '../../../QuantityAmount';

export class ProductsReportUserCell {
  userId: number;
  value: QuantityAmount;

  constructor({ userId, value }: ProductsReportUserCell) {
    this.userId = userId;
    this.value = value;
  }

  static fromDto(dto: ProductsReportUserCellDto): ProductsReportUserCell {
    return new ProductsReportUserCell({
      userId: dto.userId,
      value: dto.value,
    });
  }

  static fromDtos(dtos: ProductsReportUserCellDto[]): ProductsReportUserCell[] {
    return dtos.map(this.fromDto);
  }
}
