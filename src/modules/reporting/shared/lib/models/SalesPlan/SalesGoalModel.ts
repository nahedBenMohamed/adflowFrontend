import type { SalesValues } from '../SalesValues';

export class SalesGoalModel {
  amount: SalesValues;
  quantity: SalesValues;

  constructor({ amount, quantity }: SalesGoalModel) {
    this.amount = amount;
    this.quantity = quantity;
  }

  static create(amount: SalesValues, quantity: SalesValues): SalesGoalModel {
    return new SalesGoalModel({ amount, quantity });
  }
}
