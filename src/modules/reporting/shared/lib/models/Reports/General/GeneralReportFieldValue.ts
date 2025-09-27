import type { GeneralReportFieldValueDto } from '../../../../../api';

export class GeneralReportFieldValue {
  optionId: number;
  optionLabel: string;
  quantity: number;
  amount: number;

  constructor({ optionId, optionLabel, quantity, amount }: GeneralReportFieldValue) {
    this.optionId = optionId;
    this.optionLabel = optionLabel;
    this.quantity = quantity;
    this.amount = amount;
  }

  static fromDto(dto: GeneralReportFieldValueDto): GeneralReportFieldValue {
    return new GeneralReportFieldValue({
      optionId: dto.optionId,
      optionLabel: dto.optionLabel,
      quantity: dto.quantity,
      amount: dto.amount,
    });
  }

  static fromDtos(dtos: GeneralReportFieldValueDto[]): GeneralReportFieldValue[] {
    return dtos.map(this.fromDto);
  }
}
