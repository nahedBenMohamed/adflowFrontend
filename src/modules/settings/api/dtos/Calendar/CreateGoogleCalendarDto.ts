import type { Nullable } from '@/shared';
import type { CalendarType } from '../../../shared';
import type { GoogleCalendarLinkedDto } from './GoogleCalendarLinkedDto';

export class CreateGoogleCalendarDto {
  externalId: string;
  title: string;
  readonly: boolean;
  type: CalendarType;
  objectId: number;
  responsibleId: number;
  processAll?: boolean | null;
  linked?: Nullable<GoogleCalendarLinkedDto[]>;
  token: string;
  syncEvents?: boolean;

  constructor({
    externalId,
    title,
    readonly,
    type,
    objectId,
    responsibleId,
    processAll,
    linked,
    token,
    syncEvents,
  }: CreateGoogleCalendarDto) {
    this.externalId = externalId;
    this.title = title;
    this.readonly = readonly;
    this.type = type;
    this.objectId = objectId;
    this.responsibleId = responsibleId;
    this.processAll = processAll;
    this.linked = linked;
    this.token = token;
    this.syncEvents = syncEvents;
  }
}
