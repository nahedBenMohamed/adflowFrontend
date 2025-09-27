import type { Nullable } from '@/shared';
import type { QuantityAmount } from '../../QuantityAmount';
import type { ScheduleReportRowDto } from './ScheduleReportRowDto';

export class ScheduleReportRow {
  ownerId: Nullable<number>;
  ownerName: Nullable<string>;
  sold: QuantityAmount;
  all: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  canceled: number;

  constructor({
    ownerId,
    ownerName,
    sold,
    all,
    scheduled,
    confirmed,
    completed,
    canceled,
  }: ScheduleReportRow) {
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.sold = sold;
    this.all = all;
    this.scheduled = scheduled;
    this.confirmed = confirmed;
    this.completed = completed;
    this.canceled = canceled;
  }

  static fromDto(dto: ScheduleReportRowDto): ScheduleReportRow {
    return new ScheduleReportRow({
      ownerId: dto.ownerId,
      ownerName: dto.ownerName,
      sold: dto.sold,
      all: dto.all,
      scheduled: dto.scheduled,
      confirmed: dto.confirmed,
      completed: dto.completed,
      canceled: dto.canceled,
    });
  }

  static fromDtos(dtos: ScheduleReportRowDto[]): ScheduleReportRow[] {
    return dtos.map(this.fromDto);
  }
}
