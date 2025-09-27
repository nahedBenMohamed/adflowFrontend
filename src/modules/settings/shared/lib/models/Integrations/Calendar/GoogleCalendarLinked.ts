import type { GoogleCalendarLinkedDto } from '../../../../../api';
import type { CalendarType } from './CalendarType';

export class GoogleCalendarLinked {
  type: CalendarType;
  objectId: number;

  constructor({ type, objectId }: GoogleCalendarLinked) {
    this.type = type;
    this.objectId = objectId;
  }

  static fromDto(dto: GoogleCalendarLinkedDto): GoogleCalendarLinked {
    return new GoogleCalendarLinked({ type: dto.type, objectId: dto.objectId });
  }

  static fromDtos(dtos: GoogleCalendarLinkedDto[]): GoogleCalendarLinked[] {
    return dtos.map(this.fromDto);
  }
}
