import type { Nullable } from '@/shared';
import type { RentalIntervalType } from '../../../shared';

export class RentalIntervalDto {
  type: RentalIntervalType;
  startTime: Nullable<string>;

  constructor({ type, startTime }: RentalIntervalDto) {
    this.type = type;
    this.startTime = startTime;
  }
}
