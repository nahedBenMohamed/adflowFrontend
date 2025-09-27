import type { CalendarAccessDto } from '../../../../api';
import { CalendarInfo } from './CalendarInfo';

export class CalendarAccess {
  token: string;
  calendarInfos: CalendarInfo[];

  constructor({ token, calendarInfos }: CalendarAccess) {
    this.token = token;
    this.calendarInfos = calendarInfos;
  }

  static fromDto(dto: CalendarAccessDto): CalendarAccess {
    return new CalendarAccess({
      token: dto.token,
      calendarInfos: CalendarInfo.fromDtos(dto.calendarInfos),
    });
  }
}
