import type { ComparativeReportValueDto } from '../../../../../api';
import type { QuantityAmount } from '../../QuantityAmount';

export class ComparativeReportValue {
  current: QuantityAmount;
  previous: QuantityAmount;
  difference: QuantityAmount;

  constructor({
    current,
    previous,
    difference,
  }: {
    current: QuantityAmount;
    previous: QuantityAmount;
    difference: QuantityAmount;
  }) {
    this.current = current;
    this.previous = previous;
    this.difference = difference;
  }

  static fromDto(dto: ComparativeReportValueDto): ComparativeReportValue {
    return new ComparativeReportValue({
      current: dto.current,
      previous: dto.previous,
      difference: dto.difference,
    });
  }
}
