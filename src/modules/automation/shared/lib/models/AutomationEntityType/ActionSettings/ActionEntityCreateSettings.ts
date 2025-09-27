import type { Nullable } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionEntityCreateSettings extends ActionCommonSettings {
  entityTypeId: number;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  ownerId?: Nullable<number>;
  name?: Nullable<string>;
}
