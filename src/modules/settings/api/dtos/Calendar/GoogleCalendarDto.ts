import type { Nullable } from '@/shared';
import type { CalendarType } from '../../../shared';
import type { GoogleCalendarLinkedDto } from './GoogleCalendarLinkedDto';

export interface GoogleCalendarDto {
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
  linked?: Nullable<GoogleCalendarLinkedDto[]>;
}
