import type { Nullable } from '@/shared';
import type { DeadlineType } from '../DeadlineType';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionActivityCreateSettings extends ActionCommonSettings {
  text: string;
  activityTypeId: number;
  deadlineType: DeadlineType;
  deferStart?: Nullable<number>;
  deadlineTime?: Nullable<number>;
  responsibleUserId?: Nullable<number>;
}
