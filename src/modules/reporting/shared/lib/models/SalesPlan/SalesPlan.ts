import type { DatePeriodDto, SalesPlanDto } from '../../../../api';

export class SalesPlan {
  userId: number;
  period: DatePeriodDto;
  amount: number;
  quantity: number;

  constructor({ userId, period, amount, quantity }: SalesPlan) {
    this.userId = userId;
    this.period = period;
    this.amount = amount;
    this.quantity = quantity;
  }

  static fromDto(dto: SalesPlan): SalesPlan {
    return new SalesPlan({
      userId: dto.userId,
      period: dto.period,
      amount: dto.amount,
      quantity: dto.quantity,
    });
  }

  static fromDtos(dtos: SalesPlanDto[]): SalesPlan[] {
    return dtos.map(this.fromDto);
  }
}
