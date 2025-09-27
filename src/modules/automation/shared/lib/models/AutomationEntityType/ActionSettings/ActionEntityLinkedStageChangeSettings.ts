import type { ChangeStageType } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionEntityLinkedStageChangeSettings extends ActionCommonSettings {
  stageId: number;
  entityTypeId: number;
  operationType: ChangeStageType;
}
