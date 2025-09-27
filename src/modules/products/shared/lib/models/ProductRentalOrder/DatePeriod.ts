import { UtcDate } from '@/shared';
import type { DatePeriodDto } from '../../../../api';

export class DatePeriod {
  startDate: UtcDate;
  endDate: UtcDate;

  constructor({ startDate, endDate }: { startDate: UtcDate; endDate: UtcDate }) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static fromDto(dto: DatePeriodDto): DatePeriod {
    return new DatePeriod({
      startDate: UtcDate.parseISOWithoutUnix(dto.startDate),
      endDate: UtcDate.parseISOWithoutUnix(dto.endDate),
    });
  }

  static fromDtos(dtos: DatePeriodDto[]): DatePeriod[] {
    return dtos.map(this.fromDto);
  }
}
