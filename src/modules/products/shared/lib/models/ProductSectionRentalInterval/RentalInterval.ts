import type { Nullable } from '@/shared';
import type { RentalIntervalDto } from '../../../../api';
import type { RentalIntervalType } from './RentalIntervalType';

export class RentalInterval {
  type: RentalIntervalType;
  startTime: Nullable<string>;

  constructor({ type, startTime }: { type: RentalIntervalType; startTime: Nullable<string> }) {
    this.type = type;
    this.startTime = startTime;
  }

  static fromDto(dto: RentalIntervalDto): RentalInterval {
    return new RentalInterval({
      type: dto.type,
      startTime: dto.startTime,
    });
  }
}
