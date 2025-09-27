import type { Nullable } from '@/shared';
import type { GoogleCalendarDto } from '../../../../../api';
import type { CalendarType } from './CalendarType';
import { GoogleCalendarLinked } from './GoogleCalendarLinked';

export class GoogleCalendar {
  id: number;
  createdBy: number;
  createdAt: string;
  externalId: string;
  title: string;
  readonly: boolean;
  type: CalendarType;
  objectId: number;
  responsibleId: number;
  processAll?: Nullable<boolean>;
  linked?: Nullable<GoogleCalendarLinked[]>;

  constructor({
    id,
    createdBy,
    createdAt,
    externalId,
    title,
    readonly,
    type,
    objectId,
    responsibleId,
    processAll,
    linked,
  }: GoogleCalendar) {
    this.id = id;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.externalId = externalId;
    this.title = title;
    this.readonly = readonly;
    this.type = type;
    this.objectId = objectId;
    this.responsibleId = responsibleId;
    this.processAll = processAll;
    this.linked = linked;
  }

  static fromDto(dto: GoogleCalendarDto): GoogleCalendar {
    return new GoogleCalendar({
      id: dto.id,
      createdBy: dto.createdBy,
      createdAt: dto.createdAt,
      externalId: dto.externalId,
      title: dto.title,
      readonly: dto.readonly,
      type: dto.type,
      objectId: dto.objectId,
      responsibleId: dto.responsibleId,
      processAll: dto.processAll,
      linked: dto.linked ? GoogleCalendarLinked.fromDtos(dto.linked) : null,
    });
  }

  static fromDtos(dtos: GoogleCalendarDto[]): GoogleCalendar[] {
    return dtos.map(this.fromDto);
  }
}
