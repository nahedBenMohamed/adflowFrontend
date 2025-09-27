import type { Nullable } from '@/shared';
import type { GeneralReportEntityDto } from '../../../../../api';
import type { QuantityAmount } from '../../QuantityAmount';

export class GeneralReportEntity {
  all: QuantityAmount;
  open: QuantityAmount;
  lost: QuantityAmount;
  won: QuantityAmount;
  avgAmount: number;
  avgClose: number;

  constructor({
    all,
    open,
    lost,
    won,
    avgAmount,
    avgClose,
  }: {
    all: QuantityAmount;
    open: QuantityAmount;
    lost: QuantityAmount;
    won: QuantityAmount;
    avgAmount: number;
    avgClose: number;
  }) {
    this.all = all;
    this.open = open;
    this.lost = lost;
    this.won = won;
    this.avgAmount = avgAmount;
    this.avgClose = avgClose;
  }

  static fromDto(dto: Nullable<GeneralReportEntityDto>): Nullable<GeneralReportEntity> {
    if (!dto) return null;

    return new GeneralReportEntity({
      all: dto.all,
      open: dto.open,
      lost: dto.lost,
      won: dto.won,
      avgAmount: dto.avgAmount,
      avgClose: dto.avgClose,
    });
  }
}
