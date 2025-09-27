import type { QuantityAmount } from '../../../../shared';

export interface GeneralReportEntityDto {
  all: QuantityAmount;
  open: QuantityAmount;
  lost: QuantityAmount;
  won: QuantityAmount;
  avgAmount: number;
  avgClose: number;
}
