import type { Nullable } from '@/shared';

export interface CurrentDiscountDto {
  endAt: string;
  percent: number;
  code?: Nullable<string>;
}
