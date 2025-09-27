import type { Nullable } from '@/shared';
import type { CalendarType } from '../../../shared';
import type { GoogleCalendarLinkedDto } from './GoogleCalendarLinkedDto';

export class UpdateGoogleCalendarDto {
  externalId?: string;
  title?: string;
  readonly?: boolean;
  type?: CalendarType;
  objectId?: number;
  responsibleId?: number;
  processAll?: boolean | null;
  linked?: Nullable<GoogleCalendarLinkedDto[]>;

  constructor({
    externalId,
    title,
    readonly,
    type,
    objectId,
    responsibleId,
    processAll,
    linked,
  }: UpdateGoogleCalendarDto) {
    this.externalId = externalId;
    this.title = title;
    this.readonly = readonly;
    this.type = type;
    this.objectId = objectId;
    this.responsibleId = responsibleId;
    this.processAll = processAll;
    this.linked = linked;
  }
}
