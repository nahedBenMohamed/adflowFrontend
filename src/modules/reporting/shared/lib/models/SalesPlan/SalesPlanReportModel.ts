import type { SalesPlanReport } from '../../../../api';
import type { SalesPlanValue } from './SalesPlanValue';

export class SalesPlanReportModel {
  amount: SalesPlanValue;
  quantity: SalesPlanValue;

  constructor({ amount, quantity }: SalesPlanReport) {
    this.amount = amount;
    this.quantity = quantity;
  }

  static fromDto(dto: SalesPlanReport): SalesPlanReportModel {
    return new SalesPlanReportModel({
      amount: dto.amount,
      quantity: dto.quantity,
    });
  }
}
