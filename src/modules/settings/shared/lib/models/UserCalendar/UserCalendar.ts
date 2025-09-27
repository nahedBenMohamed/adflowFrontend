import type { UserCalendarDto } from '../../../../api';
import { UserCalendarInterval } from './UserCalendarInterval';

export class UserCalendar {
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  appointmentLimit?: number;
  intervals: UserCalendarInterval[];

  constructor({ timeBufferBefore, timeBufferAfter, appointmentLimit, intervals }: UserCalendar) {
    this.timeBufferBefore = timeBufferBefore;
    this.timeBufferAfter = timeBufferAfter;
    this.appointmentLimit = appointmentLimit;
    this.intervals = intervals;
  }

  static fromDto(dto: UserCalendarDto): UserCalendar {
    return new UserCalendar({
      timeBufferBefore: dto.timeBufferBefore,
      timeBufferAfter: dto.timeBufferAfter,
      appointmentLimit: dto.appointmentLimit,
      intervals: dto.intervals ? UserCalendarInterval.fromDtos(dto.intervals) : [],
    });
  }
}
