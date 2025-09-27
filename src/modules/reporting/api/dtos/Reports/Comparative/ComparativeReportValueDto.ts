import type { QuantityAmount } from '../../../../shared';

export interface ComparativeReportValueDto {
  current: QuantityAmount;
  previous: QuantityAmount;
  difference: QuantityAmount;
}
