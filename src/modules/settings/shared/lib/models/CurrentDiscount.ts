import { type Nullable, UtcDate } from '@/shared';
import type { CurrentDiscountDto } from '../../../api';

export class CurrentDiscount {
  endAt: UtcDate;
  percent: number;
  code?: Nullable<string>;

  constructor({ percent, endAt, code }: CurrentDiscount) {
    this.code = code;
    this.endAt = endAt;
    this.percent = percent;
  }

  static fromDto(dto: CurrentDiscountDto): CurrentDiscount {
    return new CurrentDiscount({
      code: dto.code,
      percent: dto.percent,
      endAt: UtcDate.parseISO(dto.endAt),
    });
  }
}
