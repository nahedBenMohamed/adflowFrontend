export class GeneralReportFieldValueDto {
  optionId: number;
  optionLabel: string;
  quantity: number;
  amount: number;

  constructor({ optionId, optionLabel, quantity, amount }: GeneralReportFieldValueDto) {
    this.optionId = optionId;
    this.optionLabel = optionLabel;
    this.quantity = quantity;
    this.amount = amount;
  }
}
