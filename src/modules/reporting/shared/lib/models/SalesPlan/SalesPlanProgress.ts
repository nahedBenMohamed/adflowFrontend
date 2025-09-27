import type { SalesPlanProgressDto } from '../../../../api';

export class SalesPlanProgress {
  userId: number;
  currentQuantity: number;
  currentAmount: number;
  plannedQuantity: number;
  plannedAmount: number;

  constructor({
    userId,
    currentQuantity,
    currentAmount,
    plannedQuantity,
    plannedAmount,
  }: SalesPlanProgress) {
    this.userId = userId;
    this.currentQuantity = currentQuantity;
    this.currentAmount = currentAmount;
    this.plannedQuantity = plannedQuantity;
    this.plannedAmount = plannedAmount;
  }

  static fromDto(dto: SalesPlanProgressDto): SalesPlanProgress {
    return new SalesPlanProgress({
      userId: dto.userId,
      currentQuantity: dto.currentQuantity,
      currentAmount: dto.currentAmount,
      plannedQuantity: dto.plannedQuantity,
      plannedAmount: dto.plannedAmount,
    });
  }

  static fromDtos(dtos: SalesPlanProgress[]): SalesPlanProgressDto[] {
    return dtos.map(this.fromDto);
  }
}
