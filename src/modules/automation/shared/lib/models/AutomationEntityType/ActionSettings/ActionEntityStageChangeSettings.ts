import type { ChangeStageType } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionEntityStageChangeSettings extends ActionCommonSettings {
  stageId: number;
  operationType: ChangeStageType;
}
