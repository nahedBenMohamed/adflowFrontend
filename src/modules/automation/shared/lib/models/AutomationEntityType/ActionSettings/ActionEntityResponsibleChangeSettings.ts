import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionEntityResponsibleChangeSettings extends ActionCommonSettings {
  responsibleUserId: number;
}
