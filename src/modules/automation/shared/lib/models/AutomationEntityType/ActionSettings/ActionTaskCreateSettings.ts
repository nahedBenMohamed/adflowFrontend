import type { Nullable } from '@/shared';
import type { DeadlineType } from '../DeadlineType';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionTaskCreateSettings extends ActionCommonSettings {
  text: string;
  title: string;
  deadlineType: DeadlineType;
  deferStart?: Nullable<number>;
  deadlineTime?: Nullable<number>;
  responsibleUserId?: Nullable<number>;
}
