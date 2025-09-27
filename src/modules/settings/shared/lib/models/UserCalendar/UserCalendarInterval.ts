import type { WeekDays } from '@/shared';
import type { UserCalendarIntervalDto } from '../../../../api';

export class UserCalendarInterval {
  dayOfWeek: WeekDays;
  timeFrom: string;
  timeTo: string;

  constructor({ dayOfWeek, timeFrom, timeTo }: UserCalendarInterval) {
    this.dayOfWeek = dayOfWeek;
    this.timeFrom = timeFrom;
    this.timeTo = timeTo;
  }

  static fromDto(dto: UserCalendarIntervalDto): UserCalendarInterval {
    return new UserCalendarInterval({
      dayOfWeek: dto.dayOfWeek,
      timeFrom: dto.timeFrom,
      timeTo: dto.timeTo,
    });
  }

  static fromDtos(dtos: UserCalendarIntervalDto[]): UserCalendarInterval[] {
    return dtos.map(UserCalendarInterval.fromDto);
  }
}
